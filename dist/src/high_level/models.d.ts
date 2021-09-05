import { Deployment } from "grid3_client";
declare enum Operations {
    deploy = "deploy",
    update = "update"
}
declare class TwinDeployment {
    deployment: Deployment;
    operation: Operations;
    publicIPs: number;
    nodeId: number;
    constructor(deployment: Deployment, operation: Operations, publicIPs: number, nodeId: number);
}
export { TwinDeployment, Operations };
