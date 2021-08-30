import { Znet, Workload } from 'grid3_client';
declare class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}
declare class Node {
    node_id: number;
    contract_id: number;
    reserved_ip: string[];
}
declare class Network {
    name: string;
    ip_range: string;
    userPrivKey: string;
    accessPubKey: string;
    userSubnet: string;
    accessSubnet: string;
    nodes: Node[];
    workloads: [];
    accessNodeId: number;
    endpoint: string;
    constructor(name: any, ip_range: any);
    addAccess(): void;
    addNode(): void;
    load(workloads?: boolean): void;
    exists(): boolean;
    nodeExists(node_id: any): boolean;
    create(ip_range: string, machine_ip: string, node_id: number, metadata?: string, description?: string, version?: number): Promise<Workload>;
    generateWireguardKeypair(): Promise<WireGuardKeys>;
    getPublicKey(privateKey: string): Promise<string>;
    getNetworks(): Object;
    getNetworkNames(): string[];
    getUserNodeAccessNodeSubnets(ip_range: any, machine_ip: any, node_id: any): any;
    getFreePort(node_id: any): Promise<number>;
    isPrivateIP(ip: any): any;
    getNodeEndpoint(node_id: any): Promise<any>;
    getUserWireguardConfig(): string;
    setupNetworkConfig(ip_range: any, machine_ip: any, node_id: any): Promise<Znet>;
    save(contract_id: string, machine_ip: string, node_id: number): Promise<void>;
}
export { Network };
