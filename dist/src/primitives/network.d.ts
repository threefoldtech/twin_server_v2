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
    constructor(name: string, ip_range: string);
    addAccess(node_id: number, ipv4: boolean): Promise<string>;
    addNode(node_id: number, metadata?: string, description?: string): Promise<Workload>;
    updateNetwork(znet: any): Znet;
    updateNetworkDeployments(): void;
    load(deployments?: boolean): Promise<void>;
    exists(): boolean;
    nodeExists(node_id: number): boolean;
    generateWireguardKeypair(): Promise<WireGuardKeys>;
    getPublicKey(privateKey: string): Promise<string>;
    getNodeWGPublicKey(node_id: number): Promise<string>;
    getNodeWGListeningPort(node_id: number): number;
    getFreeIP(node_id: number, subnet?: string): string;
    getNodeReservedIps(node_id: number): string[];
    getNodeSubnet(node_id: number): string;
    getReservedSubnets(): string[];
    getFreeSubnet(): string;
    getAccessPoints(): Promise<AccessPoint[]>;
    getNetworks(): Object;
    getNetworkNames(): string[];
    getFreePort(node_id: number): Promise<number>;
    isPrivateIP(ip: string): boolean;
    getNodeEndpoint(node_id: number): Promise<string>;
    wgRoutingIP(subnet: string): string;
    getWireguardConfig(subnet: string, userprivKey: string, peerPubkey: string, endpoint: string): string;
    save(contract_id: string, node_id: number): Promise<void>;
    generatePeers(): Promise<void>;
}
export { Network };
