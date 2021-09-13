import { Deployment, Workload } from "grid3_client";
declare class DeploymentFactory {
    create(workloads: Workload[], expiration: number, metadata?: string, description?: string, version?: number): Deployment;
    UpdateDeployment(oldDeployment: Deployment, newDeployment: Deployment): Deployment;
    fromObj(deployment: Object): Deployment;
}
export { DeploymentFactory };
