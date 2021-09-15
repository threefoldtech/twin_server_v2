import { Deployment } from "grid3_client";
import { Network } from "../primitives/network";
declare enum Operations {
    deploy = "deploy",
    update = "update",
    delete = "delete"
}
declare class TwinDeployment {
    deployment: Deployment;
    operation: Operations;
    publicIps: number;
    nodeId: number;
    network: Network;
    constructor(deployment: Deployment, operation: Operations, publicIps: number, nodeId: number, network?: Network);
}
export { TwinDeployment, Operations };
