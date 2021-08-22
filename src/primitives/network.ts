import { Znet, Workload, WorkloadTypes, Peer } from 'grid3_client'
const { Wg } = require('wireguard-wrapper');

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
    async create(name: string, subnet: string, ip_range: string, wireguard_listen_port: number, metadata: string = "", description: string = "", version: number = 0): Promise<Workload> {
        let znet = new Znet();
        znet.subnet = subnet;
        znet.ip_range = ip_range;
        const keys = await this._generateWireguardKeypair()
        znet.wireguard_private_key = keys.privateKey
        znet.wireguard_listen_port = wireguard_listen_port;
        znet.peers = this.peers;

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

}

export { Network }