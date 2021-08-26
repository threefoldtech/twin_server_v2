import { Znet, Workload, WorkloadTypes, Peer } from 'grid3_client'
const { Wg } = require('wireguard-wrapper');
const Addr = require('netaddr').Addr;
import { loadFromFile, appPath } from "../helpers/jsonfs"
import * as PATH from "path"
// need to be gotten from proxy server
const AccessNodeID = 2
// need to be gotten from rmb to the node
const WireguardPort = 12334

class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}
class Network {
    peers: Peer[]
    addPeer(subnet: string, wireguard_public_key: string, allowed_ips: string[]) {
        let peer = new Peer();
        peer.subnet = subnet;
        peer.wireguard_public_key = wireguard_public_key;
        peer.allowed_ips = allowed_ips
        this.peers.push(peer);
    }
    async create(name: string, ip_range: string, machine_ip: string, node_id: number, metadata: string = "", description: string = "", version: number = 0): Promise<Workload> {
        let [userSubnet, NodeSubnet, accessNodeSubnet] = this.getUserNodeAccessNodeSubnets(name, ip_range, machine_ip, node_id)
        if (NodeSubnet && accessNodeSubnet && this.getNetworkNames().includes(name)) {
            // update network on the access node and deploy network on the new node
        }
        else if (NodeSubnet && accessNodeSubnet && !this.getNetworkNames().includes(name)) {
            // deploy network on the access node and deploy network on the new node
        }
        else if (NodeSubnet && !accessNodeSubnet && !this.getNetworkNames().includes(name)) {
            // deploy only on the access node with is the new node as well
        }
        else {
            // do nothing
        }

        let znet = new Znet();
        znet.subnet = NodeSubnet;
        znet.ip_range = ip_range;
        const keys = await this._generateWireguardKeypair()
        znet.wireguard_private_key = keys.privateKey
        znet.wireguard_listen_port = WireguardPort;

        // Add peers before set them on the network workload
        znet.peers = this.peers;

        // save network configs to filesystem
        // prepare the wireguard config for user

        let znet_workload = new Workload();
        znet_workload.version = version || 0;
        znet_workload.name = name;
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
    getUserNodeAccessNodeSubnets(name, ip_range, machine_ip, node_id) {
        let targetNodeSubnet = ""
        if (!machine_ip) {
            targetNodeSubnet = Addr(machine_ip).mask(24).toString()
        }
        let networkRange = new Addr(ip_range)
        let subnet = networkRange.mask(24)
        if (this.getNetworkNames().includes(name)) {
            let network = this.getNetworks()[name]
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
                            return [network.subnet, "", ""]
                        }
                    }
                    let accessNodeSubnet = ""
                    if (network.nodes[i].node_id === AccessNodeID) {
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
            if (AccessNodeID === node_id) {
                subnets.pop()
                subnets.push("")
            }
            return subnets
        }
    }

}

export { Network }