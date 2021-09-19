import { Deployment, WorkloadTypes, Workload } from "grid3_client";
import { TwinDeployment } from "../high_level/models";
declare class HighLevelBase {
    _filterWorkloads(deployment: Deployment, names: string[], types?: WorkloadTypes[]): any[][];
    _deleteMachineNetwork(deployment: Deployment, remainingWorkloads: Workload[], deletedMachineWorkloads: Workload[], node_id: number): Promise<any[][]>;
    _delete(deployment: Deployment, names: string[], types?: WorkloadTypes[]): Promise<TwinDeployment[]>;
}
export { HighLevelBase };
