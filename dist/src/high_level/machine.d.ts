import { TwinDeployment } from "./models";
import { Network } from "../primitives/index";
declare class VirtualMachine {
    create(name: string, nodeId: number, flist: string, cpu: number, memory: number, disks: Object[], publicIp: boolean, network: Network, entrypoint: string, env: Object, metadata?: string, description?: string): Promise<[TwinDeployment[], string]>;
}
export { VirtualMachine };
