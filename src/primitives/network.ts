const { Wg } = require('wireguard-wrapper');
const Addr = require('netaddr').Addr;
const Private = require("private-ip")
import { Znet, Workload, WorkloadTypes, Peer, MessageBusClient } from 'grid3_client'
import { loadFromFile, dumpToFile, appPath } from "../helpers/jsonfs"
import * as PATH from "path"
import { getRandomNumber } from "../helpers/utils"
import { getNodeTwinId, getAccessNodes } from "./utils"


class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}

class Node {
    node_id: number;
    contract_id: number;
    reserved_ips: string[];
}

class AccessPoint {
    subnet: string;
    wireguard_public_key: string;
    node_id: number;
}

class Network {
    name: string
    ipRange: string
    nodes: Node[]
    deployments: Object[]
    reservedSubnets: string[]
    networks: Znet[]
    accessPoints: AccessPoint[]

    constructor(name, ip_range) {
        this.name = name;
        this.ipRange = ip_range;
        if (Addr(ip_range).prefix !== 16) {
            throw Error("Network ip_range should be with prefix 16")
        }
        if (!this.isPrivateIP(ip_range)) {
            throw Error("Network ip_range should be private range")
        }
        this.load(true)
    }

    addAccess() {

    }

    async addNode(node_id, metadata, description) {
        if (this.nodeExists(node_id)) {
            return
        }
        const keypair = await this.generateWireguardKeypair()
        let znet = new Znet();
        znet.subnet = this.getFreeSubnet();
        znet.ip_range = this.ipRange;
        znet.wireguard_private_key = keypair.privateKey
        znet.wireguard_listen_port = await this.getFreePort(node_id);

        this.networks.push(znet);
        this.generatePeers()
        this.updateNetworkDeployments()

        for (const net of this.networks) {
            if (net.subnet === znet.subnet) {
                znet = net;
            }
        }

        let znet_workload = new Workload();
        znet_workload.version = 0;
        znet_workload.name = this.name;
        znet_workload.type = WorkloadTypes.network;
        znet_workload.data = znet;
        znet_workload.metadata = metadata;
        znet_workload.description = description;
        return znet_workload;
    }

    updateNetworkDeployments() {
        for (const net of this.networks) {
            for (let deployment of this.deployments) {
                let workloads = deployment["workloads"]
                for (let workload of workloads) {
                    if (workload["type"] !== WorkloadTypes.network) {
                        continue;
                    }
                    if (net.subnet !== workload["data"]["subnet"]) {
                        continue;
                    }
                    workload["data"] = net
                    break;
                }
                deployment["workloads"] = workloads
            }
        }
    }

    async load(deployments = false) {
        const networks = this.getNetworks()
        if (!Object.keys(networks).includes(this.name)) {
            return
        }
        const network = networks[this.name]
        if (network.ip_range !== this.ipRange) {
            throw Error(`The same network name ${this.name} with different ip range is already exist`)
        }
        for (let node of network.nodes) {
            const n: Node = node
            this.nodes.push(n)
        }
        if (deployments) {
            const rmbCL = new MessageBusClient()
            for (let node of this.nodes) {
                const node_twin_id = await getNodeTwinId(node.node_id);
                const msg = rmbCL.prepare("zos.deployment.get", [node_twin_id], 0, 2)
                rmbCL.send(msg, JSON.stringify({ "contract_id": node.contract_id }))
                const result = await rmbCL.read(msg)
                if (result[0].err) {
                    console.error(`Could not load network deployment ${node.contract_id} due to error: ${result[0].err}`)
                }
                const res = JSON.parse(result[0].dat)
                res["node_id"] = node.node_id
                this.deployments.push(res)
                for (const workload of res["workloads"]) {
                    if (workload["type"] !== WorkloadTypes.network) {
                        continue
                    }
                    let znet = workload["data"]
                    znet["node_id"] = node.node_id
                    this.networks.push(znet)
                }
            }
            this.getAccessPoints()
        }
    }

    exists() {
        return this.getNetworkNames().includes(this.name)
    }

    nodeExists(node_id) {
        for (let node of this.nodes) {
            if (node.node_id === node_id) {
                return true
            }
        }
        return false
    }

    async generateWireguardKeypair(): Promise<WireGuardKeys> {
        return Wg.genkey().then(function (privateKey) {
            return Wg.pubkey(privateKey).then(function (publicKey) {
                let wireguardKeys = new WireGuardKeys()
                wireguardKeys.privateKey = privateKey;
                wireguardKeys.publicKey = publicKey;
                return wireguardKeys
            });
        });
    }

    async getPublicKey(privateKey: string): Promise<string> {
        return Wg.pubkey(privateKey).then(function (publicKey) {
            return publicKey
        });
    }

    getFreeIP(node_id: number, subnet: string = "") {
        let ip;
        if (!this.nodeExists(node_id) && subnet) {
            ip = Addr(subnet).mask(32)
        }
        else if (this.nodeExists(node_id)) {
            ip = Addr(this.getNodeSubnet(node_id)).mask(32)
            const reserved_ips = this.getNodeReservedIps(node_id)
            while (reserved_ips.includes(ip.toString().split("/")[0])) {
                ip = ip.increment()
            }
        }
        else {
            throw Error("node_id or subnet must be specified")
        }
        if (ip) {
            ip = ip.toString().split("/")[0]
            let found = false
            for (const node of this.nodes) {
                if (node.node_id === node_id) {
                    node.reserved_ips.push(ip)
                    found = true
                    break
                }
            }
            if (!found) {
                let node = new Node()
                node.node_id = node_id
                node.reserved_ips = [ip]
                this.nodes.push(node)
            }
            return ip
        }
    }

    getNodeReservedIps(node_id: number) {
        for (const node of this.nodes) {
            if (node.node_id !== node_id) {
                continue
            }
            return node.reserved_ips
        }
    }

    getNodeSubnet(node_id) {
        for (const deployment of this.deployments) {
            if (deployment["node_id"] !== node_id) {
                continue
            }
            for (const workload of deployment["workloads"]) {
                if (workload["type"] !== WorkloadTypes.network) {
                    continue
                }
                return workload["data"]["subnet"]
            }
        }
    }

    getReservedSubnets() {
        for (const node of this.nodes) {
            const subnet = this.getNodeSubnet(node.node_id)
            if (subnet && !this.reservedSubnets.includes(subnet)) {
                this.reservedSubnets.push(subnet)
            }
        }
        for (const network of this.networks) {
            if (!this.reservedSubnets.includes(network.subnet)) {
                this.reservedSubnets.push(network.subnet)
            }
        }
        return this.reservedSubnets
    }

    getFreeSubnet() {
        const reservedSubnets = this.getReservedSubnets()
        let subnet = Addr(this.ipRange).mask(24)
        while (reservedSubnets.includes(subnet.toString())) {
            subnet = subnet.increment()
        }
        this.reservedSubnets.push(subnet.toString())
        return subnet.toString()
    }

    getAccessPoints() {
        let nodesWGPubkeys = []
        for (const network of this.networks) {
            const pubkey = this.getPublicKey(network.wireguard_private_key)
            nodesWGPubkeys.push(pubkey)
        }
        for (const network of this.networks) {
            for (const peer of network.peers) {
                if (nodesWGPubkeys.includes(peer.wireguard_public_key)) {
                    continue
                }
                let accessPoint = new AccessPoint()
                accessPoint.subnet = peer.subnet
                accessPoint.wireguard_public_key = peer.wireguard_public_key
                accessPoint.node_id = network["node_id"]
                this.accessPoints.push(accessPoint)
            }
        }
        return this.accessPoints
    }

    getNetworks(): Object {
        const path = PATH.join(appPath, "network.json")
        return loadFromFile(path)

    }

    getNetworkNames(): string[] {
        let networks = this.getNetworks()
        return Object.keys(networks)
    }

    async getFreePort(node_id) {
        const node_twin_id = await getNodeTwinId(node_id);
        const rmbCL = new MessageBusClient()
        let msg = rmbCL.prepare("zos.network.list_wg_ports", [node_twin_id], 0, 2)
        rmbCL.send(msg, "")
        const result = await rmbCL.read(msg)
        console.log(result)

        let port = 0;
        while (!port || JSON.parse(result[0].dat).includes(port)) {
            port = getRandomNumber(1000, 65536)
        }
        return port
    }

    isPrivateIP(ip) {
        return Private(ip)
    }

    async getNodeEndpoint(node_id) {
        const node_twin_id = await getNodeTwinId(node_id);
        const rmbCL = new MessageBusClient()
        let msg = rmbCL.prepare("zos.network.public_config_get", [node_twin_id], 0, 2)
        rmbCL.send(msg, "")
        let result = await rmbCL.read(msg)
        console.log(result)

        if (!result[0].err && result[0].dat) {
            const data = JSON.parse(result[0].dat)
            const ipv4 = data.ipv4
            if (!this.isPrivateIP(ipv4)) {
                return ipv4.split("/")[0]
            }
            const ipv6 = data.ipv6
            if (!this.isPrivateIP(ipv6)) {
                return ipv6.split("/")[0]
            }
        }
        console.log(`node ${node_id} has no public config`)

        msg = rmbCL.prepare("zos.network.interfaces", [node_twin_id], 0, 2)
        rmbCL.send(msg, "")
        result = await rmbCL.read(msg)
        console.log(result)

        if (!result[0].err && result[0].dat) {
            const data = JSON.parse(result[0].dat)
            for (let iface of Object.keys(data)) {
                if (iface === "ygg0") {
                    continue
                }
                for (let ip of data[iface]) {
                    if (!this.isPrivateIP(ip)) {
                        return ip
                    }
                }
            }
        }
    }

    wgRoutingIP(subnet) {
        const subnetsParts = subnet.split(".")
        return `100.64.${subnetsParts[1]}.${subnetsParts[2].split("/")[0]}/32`
    }

    getWireguardConfig(subnet, userprivKey, peerPubkey, endpoint) {
        const userIP = this.wgRoutingIP(subnet)
        const networkIP = this.wgRoutingIP(this.ipRange)
        return `[Interface]\nAddress = ${userIP}\n
        PrivateKey = ${userprivKey}\n[Peer]\nPublicKey = ${peerPubkey}\n
        AllowedIPs = ${this.ipRange}, ${networkIP}\n
        PersistentKeepalive = 25\nEndpoint = ${endpoint}`
    }

    async save(contract_id: string, machine_ip: string, node_id: number) {
        let network;
        if (this.exists()) {
            network = this.getNetworks()[this.name];
        }
        else {
            network = {
                "ip_range": this.ipRange,
                "nodes": []
            }
        }
        let nodeFound = false
        for (let node in network.nodes) {
            if (node["node_id"] === node_id) {
                node["reserved_ips"].append(machine_ip)
                nodeFound = true
                break
            }
        }
        if (!nodeFound) {
            const node = {
                "contract_id": contract_id,
                "node_id": node_id,
                "reserved_ips": [machine_ip],
            }
            network.nodes.push(node)
        }

        let networks = this.getNetworks()
        networks[this.name] = network;
        const path = PATH.join(appPath, "network.json")
        dumpToFile(path, networks)
    }

    async generatePeers() {
        for (let n of this.networks) {
            n.peers = []
            for (const net of this.networks) {
                if (n["node_id"] === net["node_id"]) {
                    continue
                }
                let allowed_ips = []
                allowed_ips.push(net.subnet)
                allowed_ips.push(this.wgRoutingIP(net.subnet))

                // add access points as allowed ips if this node "net" is the access node and has access point to it
                for (const accessPoint of this.accessPoints) {
                    if (accessPoint.node_id === net["node_id"]) {
                        allowed_ips.push(accessPoint.subnet)
                        allowed_ips.push(this.wgRoutingIP(accessPoint.subnet))
                    }
                }
                let accessIP = await this.getNodeEndpoint(net["node_id"])
                let peer = new Peer();
                peer.subnet = net.subnet;
                peer.wireguard_public_key = await this.getPublicKey(net.wireguard_private_key);
                peer.allowed_ips = allowed_ips
                peer.endpoint = `${accessIP}:${net.wireguard_listen_port}`;
                n.peers.push(peer);
            }
            for (const accessPoint of this.accessPoints) {
                if (n["node_id"] === accessPoint.node_id) {
                    let allowed_ips = []
                    allowed_ips.push(accessPoint.subnet)
                    allowed_ips.push(this.wgRoutingIP(accessPoint.subnet))
                    let peer = new Peer();
                    peer.subnet = accessPoint.subnet;
                    peer.wireguard_public_key = accessPoint.wireguard_public_key;
                    peer.allowed_ips = allowed_ips
                    peer.endpoint = "";
                    n.peers.push(peer);
                }
            }
        }
    }
}

export { Network }
