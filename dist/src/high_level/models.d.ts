import { Deployment } from "grid3_client";
declare enum Operations {
    deploy = "deploy",
    update = "update"
}
declare class TwinDeployment {
    deployment: Deployment;
    hash: string;
    operation: Operations;
    publicIPs: number;
    nodeId: number;
    constructor(deployment: Deployment, hash: string, operation: Operations, publicIPs: number, nodeId: number);
}
export { TwinDeployment, Operations };
