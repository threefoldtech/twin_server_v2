import { Workload, Peer } from 'grid3_client';
declare class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}
declare class Network {
    peers: Peer[];
    addPeer(subnet: string, wireguard_public_key: string, allowed_ips: string[]): void;
    create(name: string, subnet: string, ip_range: string, wireguard_listen_port: number, metadata?: string, description?: string, version?: number): Promise<Workload>;
    _generateWireguardKeypair(): Promise<WireGuardKeys>;
    _getPublicKey(privateKey: string): Promise<string>;
}
export { Network };
