import { Workload, Peer } from 'grid3_client';
declare class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}
declare class Network {
    peers: Peer[];
    addPeer(subnet: string, wireguard_public_key: string, allowed_ips: string[]): void;
    create(name: string, ip_range: string, machine_ip: string, node_id: number, metadata?: string, description?: string, version?: number): Promise<Workload>;
    _generateWireguardKeypair(): Promise<WireGuardKeys>;
    _getPublicKey(privateKey: string): Promise<string>;
    getNetworks(): Object;
    getNetworkNames(): string[];
    getUserNodeAccessNodeSubnets(name: any, ip_range: any, machine_ip: any, node_id: any): any;
}
export { Network };
