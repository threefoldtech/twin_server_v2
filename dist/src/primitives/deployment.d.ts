import { Deployment, Workload } from "grid3_client";
import { Network } from "./network";
declare class DeploymentFactory {
    create(workloads: Workload[], expiration: number, metadata?: string, description?: string, version?: number): Deployment;
    UpdateDeployment(oldDeployment: Deployment, newDeployment: Deployment, network?: Network): Promise<Deployment>;
    fromObj(deployment: Object): Deployment;
}
export { DeploymentFactory };
