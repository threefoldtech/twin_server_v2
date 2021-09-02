import { Znet, Workload } from 'grid3_client';
declare class WireGuardKeys {
    privateKey: string;
    publicKey: string;
}
declare class Node {
    node_id: number;
    contract_id: number;
    reserved_ips: string[];
}
declare class AccessPoint {
    subnet: string;
    wireguard_public_key: string;
    node_id: number;
}
declare class Network {
    name: string;
    ipRange: string;
    nodes: Node[];
    deployments: Object[];
    reservedSubnets: string[];
    networks: Znet[];
    accessPoints: AccessPoint[];
    constructor(name: any, ip_range: any);
    addAccess(node_id: number, ipv4: boolean): Promise<string>;
    addNode(node_id: any, metadata: any, description: any): Promise<Workload>;
    updateNetwork(znet: any): any;
    updateNetworkDeployments(): void;
    load(deployments?: boolean): Promise<void>;
    exists(): boolean;
    nodeExists(node_id: any): boolean;
    generateWireguardKeypair(): Promise<WireGuardKeys>;
    getPublicKey(privateKey: string): Promise<string>;
    getNodeWGPublicKey(node_id: any): Promise<string>;
    getNodeWGListeningPort(node_id: any): number;
    getFreeIP(node_id: number, subnet?: string): any;
    getNodeReservedIps(node_id: number): string[];
    getNodeSubnet(node_id: any): string;
    getReservedSubnets(): string[];
    getFreeSubnet(): any;
    getAccessPoints(): Promise<AccessPoint[]>;
    getNetworks(): Object;
    getNetworkNames(): string[];
    getFreePort(node_id: any): Promise<number>;
    isPrivateIP(ip: any): any;
    getNodeEndpoint(node_id: any): Promise<any>;
    wgRoutingIP(subnet: any): string;
    getWireguardConfig(subnet: any, userprivKey: any, peerPubkey: any, endpoint: any): string;
    save(contract_id: string, machine_ips: string[], node_id: number): Promise<void>;
    generatePeers(): Promise<void>;
}
export { Network };
