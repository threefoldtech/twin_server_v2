import { Network } from "../primitives/network";
declare class Kubernetes {
    add_master(nodeId: number, secret: string, cpu: number, memory: number, diskSize: number, publicIp: boolean, network: Network, sshKey: string, metadata?: string, description?: string): Promise<[import("./models").TwinDeployment[], string]>;
    add_worker(nodeId: number, secret: string, masterIp: string, cpu: number, memory: number, diskSize: number, publicIp: boolean, network: Network, sshKey: string, metadata?: string, description?: string): Promise<[import("./models").TwinDeployment[], string]>;
}
export { Kubernetes };
