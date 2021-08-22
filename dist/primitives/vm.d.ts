import { Workload, Mount, ZNetworkInterface, ZmachineNetwork, ComputeCapacity } from "grid3_client";
declare class VM {
    _createComputeCapacity(cpu: number, memory: number): ComputeCapacity;
    _createNetworkInterface(networkName: string, ip: string): ZNetworkInterface;
    _createMachineNetwork(networkName: string, ip: string, planetary: boolean, public_ip?: string): ZmachineNetwork;
    create(name: string, flist: string, cpu: number, memory: number, disks: Mount[], networkName: string, ip: string, planetary: boolean, public_ip: string, entrypoint: string, env: Object, version?: number, metadata?: string, description?: string): Workload;
}
export { VM };
