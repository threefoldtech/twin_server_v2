import * as PATH from "path";

import { default as Wg } from "wireguard-wrapper";
import { default as Private } from "private-ip";

import { Addr } from "netaddr";
import { Znet, Workload, WorkloadTypes, Peer, MessageBusClient, Deployment } from "grid3_client";

import { loadFromFile, dumpToFile, appPath } from "../helpers/jsonfs";
import { getRandomNumber } from "../helpers/utils";
import { getNodeTwinId, getAccessNodes } from "./nodes";

class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}

class Node {
    node_id: number;
    contract_id: number;
    reserved_ips: string[] = [];
}

class AccessPoint {
    subnet: string;
    wireguard_public_key: string;
    node_id: number;
}

class Network {
    name: string;
    ipRange: string;
    nodes: Node[] = [];
    deployments: Deployment[] = [];
    reservedSubnets: string[] = [];
    networks: Znet[] = [];
    accessPoints: AccessPoint[] = [];

    constructor(name: string, ip_range: string) {
        this.name = name;
        this.ipRange = ip_range;
        if (Addr(ip_range).prefix !== 16) {
            throw Error("Network ip_range should be with prefix 16");
        }
        if (!this.isPrivateIP(ip_range)) {
            throw Error("Network ip_range should be private range");
        }
    }

    async addAccess(node_id: number, ipv4: boolean): Promise<string> {
        if (!this.nodeExists(node_id)) {
            throw Error(`Node ${node_id} does not exist in the network. Please add it first`);
        }
        const accessNodes = await getAccessNodes();
        if (Object.keys(accessNodes).includes(node_id.toString())) {
            if (ipv4 && !accessNodes[node_id]["ipv4"]) {
                throw Error(`Node ${node_id} does not have ipv4 public config.`);
            }
        } else {
            throw Error(`Node ${node_id} is not an access node.`);
        }

        const nodeWGListeningPort = this.getNodeWGListeningPort(node_id);
        let endpoint = "";
        if (accessNodes[node_id]["ipv4"]) {
            endpoint = `${accessNodes[node_id]["ipv4"].split("/")[0]}:${nodeWGListeningPort}`;
        } else if (accessNodes[node_id]["ipv6"]) {
            endpoint = `[${accessNodes[node_id]["ipv6"].split("/")[0]}]:${nodeWGListeningPort}`;
        } else {
            throw Error(`Couldn't find ipv4 or ipv6 in the node ${node_id} public config`);
        }

        const nodesWGPubkey = await this.getNodeWGPublicKey(node_id);
        const keypair = await this.generateWireguardKeypair();
        const accessPoint = new AccessPoint();
        accessPoint.node_id = node_id;
        accessPoint.subnet = this.getFreeSubnet();
        accessPoint.wireguard_public_key = keypair.publicKey;

        this.accessPoints.push(accessPoint);
        await this.generatePeers();
        this.updateNetworkDeployments();
        return this.getWireguardConfig(accessPoint.subnet, keypair.privateKey, nodesWGPubkey, endpoint);
    }

    async addNode(node_id: number, metadata = "", description = ""): Promise<Workload> {
        if (this.nodeExists(node_id)) {
            return;
        }
        const keypair = await this.generateWireguardKeypair();
        let znet = new Znet();
        znet.subnet = this.getFreeSubnet();
        znet.ip_range = this.ipRange;
        znet.wireguard_private_key = keypair.privateKey;
        znet.wireguard_listen_port = await this.getFreePort(node_id);
        znet["node_id"] = node_id;

        this.networks.push(znet);
        await this.generatePeers();
        this.updateNetworkDeployments();
        znet = this.updateNetwork(znet);

        const znet_workload = new Workload();
        znet_workload.version = 0;
        znet_workload.name = this.name;
        znet_workload.type = WorkloadTypes.network;
        znet_workload.data = znet;
        znet_workload.metadata = metadata;
        znet_workload.description = description;

        const node = new Node();
        node.node_id = node_id;
        this.nodes.push(node);

        return znet_workload;
    }

    deleteNode(node_id: number): number {
        let network;
        if (!this.exists()) {
            return 0;
        }
        let contract_id = 0;
        const nodes = [];
        for (const node of this.nodes) {
            if (node.node_id !== node_id) {
                nodes.push(node);
            } else {
                contract_id = node.contract_id;
            }
        }
        this.nodes = nodes;
        this.networks = this.networks.filter(net => net["node_id"] !== node_id);
        const net = this.networks.filter(net => net["node_id"] === node_id);
        this.reservedSubnets = this.reservedSubnets.filter(subnet => subnet === net[0].subnet);
        // if (nodes.length === 0) {
        //     this.delete()
        // }
        return contract_id;
    }

    updateNetwork(znet): Znet {
        for (const net of this.networks) {
            if (net.subnet === znet.subnet) {
                return net;
            }
        }
    }

    updateNetworkDeployments() {
        for (const net of this.networks) {
            for (const deployment of this.deployments) {
                const workloads = deployment["workloads"];
                for (const workload of workloads) {
                    if (workload["type"] !== WorkloadTypes.network) {
                        continue;
                    }
                    if (net.subnet === workload["data"]["subnet"]) {
                        workload["data"] = net;
                        break;
                    }
                }
                deployment["workloads"] = workloads;
            }
        }
    }

    async load(deployments = false) {
        const networks = this.getNetworks();
        if (!Object.keys(networks).includes(this.name)) {
            return;
        }
        const network = networks[this.name];
        if (network.ip_range !== this.ipRange) {
            throw Error(`The same network name ${this.name} with different ip range is already exist`);
        }
        for (const node of network.nodes) {
            const n: Node = node;
            this.nodes.push(n);
        }
        if (deployments) {
            const rmbCL = new MessageBusClient();
            for (const node of this.nodes) {
                const node_twin_id = await getNodeTwinId(node.node_id);
                const msg = rmbCL.prepare("zos.deployment.get", [node_twin_id], 0, 2);
                rmbCL.send(msg, JSON.stringify({ contract_id: node.contract_id }));
                const result = await rmbCL.read(msg);
                if (result[0].err) {
                    console.error(
                        `Could not load network deployment ${node.contract_id} due to error: ${result[0].err} `,
                    );
                }
                const res = JSON.parse(result[0].dat);
                res["node_id"] = node.node_id;
                this.deployments.push(res);
                for (const workload of res["workloads"]) {
                    if (
                        workload["type"] !== WorkloadTypes.network ||
                        !Addr(this.ipRange).contains(Addr(workload["data"]["subnet"]))
                    ) {
                        continue;
                    }
                    const znet = this._fromObj(workload["data"]);
                    znet["node_id"] = node.node_id;
                    this.networks.push(znet);
                }
            }
            await this.getAccessPoints();
        }
    }

    _fromObj(net: Znet): Znet {
        const znet = new Znet();
        Object.assign(znet, net);
        const peers = [];
        for (const peer of znet.peers) {
            const p = new Peer();
            Object.assign(p, peer);
            peers.push(p);
        }
        znet.peers = peers;
        return znet;
    }

    exists(): boolean {
        return this.getNetworkNames().includes(this.name);
    }

    nodeExists(node_id: number): boolean {
        for (const net of this.networks) {
            if (net["node_id"] === node_id) {
                return true;
            }
        }
        return false;
    }

    hasAccessPoint(node_id: number): boolean {
        for (const accessPoint of this.accessPoints) {
            if (node_id === accessPoint.node_id) {
                return true;
            }
        }
        return false;
    }

    async generateWireguardKeypair(): Promise<WireGuardKeys> {
        return Wg.genkey().then(function (privateKey) {
            return Wg.pubkey(privateKey).then(function (publicKey) {
                const wireguardKeys = new WireGuardKeys();
                wireguardKeys.privateKey = privateKey;
                wireguardKeys.publicKey = publicKey;
                return wireguardKeys;
            });
        });
    }

    async getPublicKey(privateKey: string): Promise<string> {
        return Wg.pubkey(privateKey).then(function (publicKey) {
            return publicKey;
        });
    }

    async getNodeWGPublicKey(node_id: number): Promise<string> {
        for (const net of this.networks) {
            if (net["node_id"] == node_id) {
                return await this.getPublicKey(net.wireguard_private_key);
            }
        }
    }

    getNodeWGListeningPort(node_id: number): number {
        for (const net of this.networks) {
            if (net["node_id"] == node_id) {
                return net.wireguard_listen_port;
            }
        }
    }

    getFreeIP(node_id: number, subnet = ""): string {
        let ip;
        if (!this.nodeExists(node_id) && subnet) {
            ip = Addr(subnet).mask(32).increment().increment();
        } else if (this.nodeExists(node_id)) {
            ip = Addr(this.getNodeSubnet(node_id)).mask(32).increment().increment();
            const reserved_ips = this.getNodeReservedIps(node_id);
            while (reserved_ips.includes(ip.toString().split("/")[0])) {
                ip = ip.increment();
            }
        } else {
            throw Error("node_id or subnet must be specified");
        }
        if (ip) {
            ip = ip.toString().split("/")[0];
            for (const node of this.nodes) {
                if (node.node_id === node_id) {
                    node.reserved_ips.push(ip);
                    return ip;
                }
            }
            throw Error(`node_id is not in the network. Please add it first`);
        }
    }

    getNodeReservedIps(node_id: number): string[] {
        for (const node of this.nodes) {
            if (node.node_id !== node_id) {
                continue;
            }
            return node.reserved_ips;
        }
        return [];
    }

    deleteReservedIp(node_id: number, ip: string): string {
        for (const node of this.nodes) {
            if (node.node_id === node_id) {
                node.reserved_ips = node.reserved_ips.filter(item => item !== ip);
            }
        }
        return ip;
    }

    getNodeSubnet(node_id: number): string {
        for (const net of this.networks) {
            if (net["node_id"] === node_id) {
                return net.subnet;
            }
        }
    }

    getReservedSubnets(): string[] {
        for (const node of this.nodes) {
            const subnet = this.getNodeSubnet(node.node_id);
            if (subnet && !this.reservedSubnets.includes(subnet)) {
                this.reservedSubnets.push(subnet);
            }
        }
        for (const accessPoint of this.accessPoints) {
            if (accessPoint.subnet && !this.reservedSubnets.includes(accessPoint.subnet)) {
                this.reservedSubnets.push(accessPoint.subnet);
            }
        }
        for (const network of this.networks) {
            if (!this.reservedSubnets.includes(network.subnet)) {
                this.reservedSubnets.push(network.subnet);
            }
        }
        return this.reservedSubnets;
    }

    getFreeSubnet(): string {
        const reservedSubnets = this.getReservedSubnets();
        let subnet = Addr(this.ipRange).mask(24).nextSibling().nextSibling();
        while (reservedSubnets.includes(subnet.toString())) {
            subnet = subnet.nextSibling();
        }
        this.reservedSubnets.push(subnet.toString());
        return subnet.toString();
    }

    async getAccessPoints(): Promise<AccessPoint[]> {
        const nodesWGPubkeys = [];
        for (const network of this.networks) {
            const pubkey = await this.getPublicKey(network.wireguard_private_key);
            nodesWGPubkeys.push(pubkey);
        }
        for (const network of this.networks) {
            for (const peer of network.peers) {
                if (nodesWGPubkeys.includes(peer.wireguard_public_key)) {
                    continue;
                }
                const accessPoint = new AccessPoint();
                accessPoint.subnet = peer.subnet;
                accessPoint.wireguard_public_key = peer.wireguard_public_key;
                accessPoint.node_id = network["node_id"];
                this.accessPoints.push(accessPoint);
            }
        }
        return this.accessPoints;
    }

    getNetworks() {
        const path = PATH.join(appPath, "network.json");
        return loadFromFile(path);
    }

    getNetworkNames(): string[] {
        const networks = this.getNetworks();
        return Object.keys(networks);
    }

    async getFreePort(node_id: number): Promise<number> {
        const node_twin_id = await getNodeTwinId(node_id);
        const rmbCL = new MessageBusClient();
        const msg = rmbCL.prepare("zos.network.list_wg_ports", [node_twin_id], 0, 2);
        rmbCL.send(msg, "");
        const result = await rmbCL.read(msg);
        console.log(result);

        let port = 0;
        while (!port || JSON.parse(result[0].dat).includes(port)) {
            port = getRandomNumber(2000, 8000);
        }
        return port;
    }

    isPrivateIP(ip: string): boolean {
        return Private(ip);
    }

    async getNodeEndpoint(node_id: number): Promise<string> {
        const node_twin_id = await getNodeTwinId(node_id);
        const rmbCL = new MessageBusClient();
        let msg = rmbCL.prepare("zos.network.public_config_get", [node_twin_id], 0, 2);
        rmbCL.send(msg, "");
        let result = await rmbCL.read(msg);
        console.log(result);

        if (!result[0].err && result[0].dat) {
            const data = JSON.parse(result[0].dat);
            const ipv4 = data.ipv4;
            if (!this.isPrivateIP(ipv4)) {
                return ipv4.split("/")[0];
            }
            const ipv6 = data.ipv6;
            if (!this.isPrivateIP(ipv6)) {
                return ipv6.split("/")[0];
            }
        }
        console.log(`node ${node_id} has no public config`);

        msg = rmbCL.prepare("zos.network.interfaces", [node_twin_id], 0, 2);
        rmbCL.send(msg, "");
        result = await rmbCL.read(msg);
        console.log(result);

        if (!result[0].err && result[0].dat) {
            const data = JSON.parse(result[0].dat);
            for (const iface of Object.keys(data)) {
                if (iface !== "zos") {
                    continue;
                }
                for (const ip of data[iface]) {
                    if (!this.isPrivateIP(ip)) {
                        return ip;
                    }
                }
            }
        }
    }

    wgRoutingIP(subnet: string): string {
        const subnetsParts = subnet.split(".");
        return `100.64.${subnetsParts[1]}.${subnetsParts[2].split("/")[0]}/32`;
    }

    getWireguardConfig(subnet: string, userprivKey: string, peerPubkey: string, endpoint: string): string {
        const userIP = this.wgRoutingIP(subnet);
        const networkIP = this.wgRoutingIP(this.ipRange);
        return `[Interface]\nAddress = ${userIP}
PrivateKey = ${userprivKey}\n\n[Peer]\nPublicKey = ${peerPubkey}
AllowedIPs = ${this.ipRange}, ${networkIP}
PersistentKeepalive = 25\nEndpoint = ${endpoint}`;
    }

    async save(contract_id = 0, node_id = 0) {
        let network;
        if (this.exists()) {
            network = this.getNetworks()[this.name];
        } else {
            network = {
                ip_range: this.ipRange,
                nodes: [],
            };
        }

        if (this.nodes.length === 0) {
            this.delete();
            return;
        }

        const nodes = [];
        for (const node of this.nodes) {
            if (node.node_id === node_id) {
                node.contract_id = contract_id;
            }
            if (!node.contract_id) {
                continue;
            }
            nodes.push({
                contract_id: node.contract_id,
                node_id: node.node_id,
                reserved_ips: this.getNodeReservedIps(node.node_id),
            });
        }
        network.nodes = nodes;
        this._save(network);
    }

    _save(network) {
        const networks = this.getNetworks();
        networks[this.name] = network;
        const path = PATH.join(appPath, "network.json");
        dumpToFile(path, networks);
    }

    delete() {
        const networks = this.getNetworks();
        delete networks[this.name];
        const path = PATH.join(appPath, "network.json");
        dumpToFile(path, networks);
    }

    async generatePeers() {
        for (const n of this.networks) {
            n.peers = [];
            for (const net of this.networks) {
                if (n["node_id"] === net["node_id"]) {
                    continue;
                }
                const allowed_ips = [];
                allowed_ips.push(net.subnet);
                allowed_ips.push(this.wgRoutingIP(net.subnet));

                // add access points as allowed ips if this node "net" is the access node and has access point to it
                for (const accessPoint of this.accessPoints) {
                    if (accessPoint.node_id === net["node_id"]) {
                        allowed_ips.push(accessPoint.subnet);
                        allowed_ips.push(this.wgRoutingIP(accessPoint.subnet));
                    }
                }
                let accessIP = await this.getNodeEndpoint(net["node_id"]);
                if (accessIP.includes(":")) {
                    accessIP = `[${accessIP}]`;
                }
                const peer = new Peer();
                peer.subnet = net.subnet;
                peer.wireguard_public_key = await this.getPublicKey(net.wireguard_private_key);
                peer.allowed_ips = allowed_ips;
                peer.endpoint = `${accessIP}:${net.wireguard_listen_port}`;
                n.peers.push(peer);
            }
            for (const accessPoint of this.accessPoints) {
                if (n["node_id"] === accessPoint.node_id) {
                    const allowed_ips = [];
                    allowed_ips.push(accessPoint.subnet);
                    allowed_ips.push(this.wgRoutingIP(accessPoint.subnet));
                    const peer = new Peer();
                    peer.subnet = accessPoint.subnet;
                    peer.wireguard_public_key = accessPoint.wireguard_public_key;
                    peer.allowed_ips = allowed_ips;
                    peer.endpoint = "";
                    n.peers.push(peer);
                }
            }
        }
    }
}

export { Network };
