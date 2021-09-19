import { Deployment } from "grid3_client";
import { TwinDeployment } from "./models";
import { HighLevelBase } from "./base";
import { Network } from "../primitives/index";
declare class VirtualMachine extends HighLevelBase {
    create(name: string, nodeId: number, flist: string, cpu: number, memory: number, disks: Object[], publicIp: boolean, network: Network, entrypoint: string, env: Object, metadata?: string, description?: string): Promise<[TwinDeployment[], string]>;
    update(oldDeployment: Deployment, name: string, nodeId: number, flist: string, cpu: number, memory: number, disks: Object[], publicIp: boolean, network: Network, entrypoint: string, env: Object, metadata?: string, description?: string): Promise<TwinDeployment>;
    delete(deployment: Deployment, names: string[]): Promise<TwinDeployment[]>;
}
export { VirtualMachine };
