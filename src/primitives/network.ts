import { Znet, Workload, WorkloadTypes, Peer, MessageBusClient } from 'grid3_client'
const { Wg } = require('wireguard-wrapper');
const Addr = require('netaddr').Addr;
import { loadFromFile, appPath } from "../helpers/jsonfs"
import * as PATH from "path"
import { getRandomNumber } from "../helpers/utils"
import { getNodeTwinId } from "./utils"

class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}
class Network {
    nodePeers: Peer[]
    accessNodePeers: Peer[]
    userPrivateKey: string
    znet: Znet
    name: string
    userSubnet: string
    node_id: number
    constructor(name) {
        this.name = name;
    }
    addPeer(subnet: string, wireguard_public_key: string, allowed_ips: string[], target: string = "nodePeers") {
        let peer = new Peer();
        peer.subnet = subnet;
        peer.wireguard_public_key = wireguard_public_key;
        peer.allowed_ips = allowed_ips
        this[target].push(peer);
    }
    async create(ip_range: string, machine_ip: string, node_id: number, metadata: string = "", description: string = "", version: number = 0): Promise<Workload> {
        const znet = await this.setupNetworkConfig(ip_range, machine_ip, node_id)
        if (!znet) {
            return
        }
        this.node_id = node_id;
        // save network configs to filesystem
        // prepare the wireguard config for user

        let znet_workload = new Workload();
        znet_workload.version = version || 0;
        znet_workload.name = this.name;
        znet_workload.type = WorkloadTypes.network;
        znet_workload.data = znet;
        znet_workload.metadata = metadata;
        znet_workload.description = description;
        return znet_workload;
    }
    async _generateWireguardKeypair(): Promise<WireGuardKeys> {
        return Wg.genkey().then(function (privateKey) {
            return Wg.pubkey(privateKey).then(function (publicKey) {
                let wireguardKeys = new WireGuardKeys()
                wireguardKeys.privateKey = privateKey;
                wireguardKeys.publicKey = publicKey;
                return wireguardKeys
            });
        });
    }
    async _getPublicKey(privateKey: string): Promise<string> {
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
                    if (Object.keys(this.getAccessNodes()).includes(network.nodes[i].node_id)) {
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
            if (Object.keys(this.getAccessNodes()).includes(node_id)) {
                subnets.pop()
                subnets.push("")
            }
            return subnets
        }
    }
    getAccessNodes() {
        // need to be gotten from proxy server
        // {node_id: ip}
        return { 2: "185.206.122.31" }
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
    getUserWireguardConfig() {
        const network = this.getNetworks()[this.name]
        const nodeSubnetParts = network.subnet.split(".")
        let accessNode;
        for (let i = 0; i < network.nodes.length; i++) {
            if (network.nodes[i].access) {
                accessNode = network.nodes[i]
                break
            }
        }
        if (!accessNode) {
            throw Error(`Couldn't find access node for this network ${this.name}`)
        }
        const accessNodePubkey = this._getPublicKey(accessNode.wireguard_private_key)
        const accessNodeSubnetParts = accessNode.subnet.split(".")
        return `[Interface]\nAddress = 100.64.${nodeSubnetParts[2]}.${nodeSubnetParts[3].slice(0, -3)}/32\n
        PrivateKey = ${network.privateKey}\n[Peer]\nPublicKey = ${accessNodePubkey}\n
        AllowedIPs = ${accessNode.subnet}, 100.64.${accessNodeSubnetParts[2]}.${accessNodeSubnetParts[3].slice(0, -3)}/32\n
        PersistentKeepalive = 25\nEndpoint = ${network.endpoint}`
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
            throw Error("deploy network on 2 different nodes is not implemented yet.")
        }
        else if (NodeSubnet && !accessNodeSubnet && !this.getNetworkNames().includes(this.name)) {
            // deploy only on the access node which is the new node as well
            const userKeypair = await this._generateWireguardKeypair()
            const nodeKeypair = await this._generateWireguardKeypair()
            this.userPrivateKey = userKeypair.privateKey

            let znet = new Znet();
            znet.subnet = NodeSubnet;
            znet.ip_range = ip_range;
            znet.wireguard_private_key = nodeKeypair.privateKey
            znet.wireguard_listen_port = await this.getFreePort(node_id);

            // Add peers before set them on the network workload
            const parts = userSubnet.split(".")
            const allowed_ips = [userSubnet, `100.64.${parts[2]}.${parts[3].slice(0, -3)}/32`]
            this.addPeer(userSubnet, userKeypair.publicKey, allowed_ips)
            znet.peers = this.nodePeers;

            // store this config on network config on filesystem
            this.znet = znet;
            return znet
        }
        else {
            // do nothing
            return
        }

    }
    storeNetwork(contract_id, machine_ip) {
        let networks = this.getNetworks();
        if (this.getNetworkNames().includes(this.name)) {

        }
        else {
            const accessNode = this.getAccessNodes()[this.node_id];
            if (!accessNode) {
                throw Error(`Can't find the access node with id ${this.node_id}`)
            }

            let network = {
                "ip_range": this.znet.ip_range,
                "subnet": this.userSubnet,
                "wireguard_private_key": this.userPrivateKey,
                "endpoint": `${accessNode.slice(0, -3)}:${this.znet.wireguard_listen_port}`,
                "nodes": []
            }

            let node = {
                "contract_id": contract_id,
                "node_id": this.node_id,
                "subnet": this.znet.subnet,
                "wireguard_private_key": this.znet.wireguard_private_key,
                "reserved_ips": [machine_ip]
                // endpoint to be added
            }
            networks[this.name] = network;
            // save it back to the network file
        }
    }

}

export { Network }