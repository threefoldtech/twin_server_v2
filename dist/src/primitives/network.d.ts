import { Znet, Workload, Peer } from 'grid3_client';
declare class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}
declare class Network {
    nodePeers: Peer[];
    accessNodePeers: Peer[];
    userPrivateKey: string;
    znet: Znet;
    name: string;
    userSubnet: string;
    node_id: number;
    constructor(name: any);
    addPeer(subnet: string, wireguard_public_key: string, allowed_ips: string[], target?: string): void;
    create(ip_range: string, machine_ip: string, node_id: number, metadata?: string, description?: string, version?: number): Promise<Workload>;
    _generateWireguardKeypair(): Promise<WireGuardKeys>;
    _getPublicKey(privateKey: string): Promise<string>;
    getNetworks(): Object;
    getNetworkNames(): string[];
    getUserNodeAccessNodeSubnets(ip_range: any, machine_ip: any, node_id: any): any;
    getAccessNodes(): {
        2: string;
    };
    getFreePort(node_id: any): Promise<number>;
    getUserWireguardConfig(): string;
    setupNetworkConfig(ip_range: any, machine_ip: any, node_id: any): Promise<Znet>;
    storeNetwork(contract_id: any, machine_ip: any): void;
}
export { Network };
