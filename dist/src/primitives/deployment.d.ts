import { Deployment, Workload } from "grid3_client";
declare class DeploymentFactory {
    create(workloads: Workload[], expiration: number, metadata?: string, description?: string, version?: number): Deployment;
}
export { DeploymentFactory };
