import { Znet, Workload, WorkloadTypes, Peer, MessageBusClient } from 'grid3_client'
const { Wg } = require('wireguard-wrapper');
const Addr = require('netaddr').Addr;
const Private = require("private-ip")
import { loadFromFile, dumpToFile, appPath } from "../helpers/jsonfs"
import * as PATH from "path"
import { getRandomNumber } from "../helpers/utils"
import { getNodeTwinId, getAccessNodes } from "./utils"


class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}

class Peers {
    peers: Peer[];
    addPeer(subnet: string, wireguard_public_key: string, allowed_ips: string[]) {
        let peer = new Peer();
        peer.subnet = subnet;
        peer.wireguard_public_key = wireguard_public_key;
        peer.allowed_ips = allowed_ips
        this.peers.push(peer);
    }
}

class Node {
    node_id: number;
    contract_id: number;
    reserved_ip: string[];
}

class Network {
    name: string
    ip_range: string
    userPrivKey: string
    accessPubKey: string
    userSubnet: string
    accessSubnet: string
    nodes: Node[]
    workloads: []
    accessNodeId: number
    endpoint: string

    constructor(name, ip_range) {
        this.name = name;
        this.ip_range = ip_range;
        this.load()
    }

    addAccess() {

    }

    addNode() {

    }

    load(workloads = false) {
        const networks = this.getNetworks()
        if (!Object.keys(networks).includes(this.name)) {
            return
        }
        const network = networks[this.name]
        if (network.ip_range !== this.ip_range) {
            throw Error("The same network name with different ip range is exist")
        }
        this.userPrivKey = network.wireguard_private_key
        this.accessPubKey = network.access_node_public_key
        this.userSubnet = network.subnet
        this.accessSubnet = network.access_subnet
        this.accessNodeId = network.access_node_id
        this.endpoint = network.endpoint

        for (let node of network.nodes) {
            const n: Node = node
            this.nodes.push(n)
        }
        if (workloads) {
            // load workload from nodes
        }
    }

    exists() {
        return this.getNetworkNames().includes(this.name)
    }

    nodeExists(node_id) {
        this.load();
        for (let node of this.nodes) {
            if (node.node_id === node_id) {
                return true
            }
        }
        return false
    }

    async create(ip_range: string, machine_ip: string, node_id: number, metadata: string = "", description: string = "", version: number = 0): Promise<Workload> {
        const znet = await this.setupNetworkConfig(ip_range, machine_ip, node_id)
        if (!znet) {
            return
        }

        let znet_workload = new Workload();
        znet_workload.version = version || 0;
        znet_workload.name = this.name;
        znet_workload.type = WorkloadTypes.network;
        znet_workload.data = znet;
        znet_workload.metadata = metadata;
        znet_workload.description = description;
        return znet_workload;
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

    getNetworks(): Object {
        const path = PATH.join(appPath, "network.json")
        return loadFromFile(path)

    }

    getNetworkNames(): string[] {
        let networks = this.getNetworks()
        return Object.keys(networks)
    }

    getUserNodeAccessNodeSubnets(ip_range, machine_ip, node_id) {
        let targetNodeSubnet = ""
        if (!machine_ip) {
            targetNodeSubnet = Addr(machine_ip).mask(24).toString()
        }
        let networkRange = new Addr(ip_range)
        let subnet = networkRange.mask(24)
        if (this.getNetworkNames().includes(this.name)) {
            let network = this.getNetworks()[this.name]
            if (ip_range !== network.ip_range) {
                throw Error(`There is another network with the same name and different IP range`)
            }
            if (network.subnet === targetNodeSubnet) {
                throw Error(`Can't assign this subnet ${targetNodeSubnet} to node ${node_id}. Subnet already assign to your wireguard config`)
            }
            if (network.subnet === subnet.toString()) {
                subnet = subnet.nextSibling()
            }
            else {
                for (let i = 0; i < network.nodes.length; i++) {
                    if (network.nodes[i].subnet === targetNodeSubnet) {
                        if (network.nodes[i].node_id !== node_id) {
                            throw Error(`Can't assign this subnet ${targetNodeSubnet} to node ${node_id}. Subnet already assign to node_id ${network.nodes[i].node_id}`)
                        }
                        else {
                            if (network.nodes[i].reserved_ips.includes(machine_ip)) {
                                throw Error("Can't assign this ip to the machine. it's already reserved")
                            }
                            return [network.subnet, "", ""]
                        }
                    }
                    let accessNodeSubnet = ""
                    if (Object.keys(getAccessNodes()).includes(network.nodes[i].node_id)) {
                        accessNodeSubnet = network.nodes[i].subnet
                    }
                    if (network.nodes[i].subnet === subnet.toString()) {
                        subnet = subnet.nextSibling()
                    }
                    else {
                        return [network.subnet, subnet.toString(), accessNodeSubnet]
                    }
                }
            }
        }
        else {
            let subnets;
            if (targetNodeSubnet === "") {
                subnets = [subnet.toString(), subnet.nextSibling().nextSibling().toString(), subnet.nextSibling().toString()]
            }
            else {
                if (targetNodeSubnet === subnet.toString()) {
                    subnets = [subnet.nextSibling().toString(), subnet.toString(), subnet.nextSibling().nextSibling().toString()]
                }
                else {
                    subnets = [subnet.toString(), targetNodeSubnet, Addr(targetNodeSubnet).nextSibling().nextSibling().toString()]
                }
            }
            if (Object.keys(getAccessNodes()).includes(node_id)) {
                subnets.pop()
                subnets.push("")
            }
            return subnets
        }
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

    getUserWireguardConfig() {
        this.load()
        const nodeSubnetParts = this.userSubnet.split(".")
        const accessNodeSubnetParts = this.accessSubnet.split(".")
        return `[Interface]\nAddress = 100.64.${nodeSubnetParts[2]}.${nodeSubnetParts[3].split("/")[0]}/32\n
        PrivateKey = ${this.userPrivKey}\n[Peer]\nPublicKey = ${this.accessPubKey}\n
        AllowedIPs = ${this.accessSubnet}, 100.64.${accessNodeSubnetParts[2]}.${accessNodeSubnetParts[3].split("/")[0]}/32\n
        PersistentKeepalive = 25\nEndpoint = ${this.endpoint}`
    }

    async setupNetworkConfig(ip_range, machine_ip, node_id) {
        let [userSubnet, NodeSubnet, accessNodeSubnet] = this.getUserNodeAccessNodeSubnets(ip_range, machine_ip, node_id)
        this.userSubnet = userSubnet;
        if (NodeSubnet && accessNodeSubnet && this.getNetworkNames().includes(this.name)) {
            // update network on the access node and deploy network on the new node
            throw Error("Update network is not implemented yet.")
        }
        else if (NodeSubnet && accessNodeSubnet && !this.getNetworkNames().includes(this.name)) {
            // deploy network on the access node and deploy network on the new node
            throw Error("Deploy network on 2 different nodes is not implemented yet.")
        }
        else if (NodeSubnet && !accessNodeSubnet && !this.getNetworkNames().includes(this.name)) {
            // deploy only on the access node which is the new node as well
            const userKeypair = await this.generateWireguardKeypair()
            const nodeKeypair = await this.generateWireguardKeypair()
            this.userPrivKey = userKeypair.privateKey
            this.accessPubKey = nodeKeypair.publicKey
            this.accessSubnet = NodeSubnet

            let znet = new Znet();
            znet.subnet = NodeSubnet;
            znet.ip_range = ip_range;
            znet.wireguard_private_key = nodeKeypair.privateKey
            znet.wireguard_listen_port = await this.getFreePort(node_id);

            // Add peers before set them on the network workload
            const parts = userSubnet.split(".")
            const allowed_ips = [userSubnet, `100.64.${parts[2]}.${parts[3].split("/")[0]}/32`]
            let peers = new Peers()
            peers.addPeer(userSubnet, userKeypair.publicKey, allowed_ips)
            znet.peers = peers.peers;

            // store this config on network config on filesystem
            return znet
        }
        else {
            // do nothing
            return
        }
    }

    async save(contract_id: string, machine_ip: string, node_id: number) {
        let network;
        if (this.exists()) {
            network = this.getNetworks()[this.name];
        }
        else {
            network = {
                "access_node_id": this.accessNodeId,
                "ip_range": this.ip_range,
                "subnet": this.userSubnet,
                "access_subnet": this.accessSubnet,
                "wireguard_private_key": this.userPrivKey,
                "access_node_public_key": this.accessPubKey,
                "endpoint": this.endpoint,
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
}

export { Network }