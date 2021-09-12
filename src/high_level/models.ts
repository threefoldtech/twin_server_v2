import { Deployment } from "grid3_client"


enum Operations {
    deploy = "deploy",
    update = "update"
}

class TwinDeployment {
    deployment: Deployment;
    operation: Operations;
    publicIps: number;
    nodeId: number;

    constructor(deployment: Deployment, operation: Operations, publicIps: number, nodeId: number) {
        this.deployment = deployment;
        this.operation = operation;
        this.publicIps = publicIps;
        this.nodeId = nodeId;
    }
}

export { TwinDeployment, Operations }