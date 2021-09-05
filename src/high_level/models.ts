import { Deployment } from "grid3_client"


enum Operations {
    deploy = "deploy",
    update = "update"
}

class TwinDeployment {
    deployment: Deployment;
    operation: Operations;
    publicIPs: number;
    nodeId: number;

    constructor(deployment: Deployment, operation: Operations, publicIPs: number, nodeId: number) {
        this.deployment = deployment;
        this.operation = operation;
        this.publicIPs = publicIPs;
        this.nodeId = nodeId;
    }
}

export { TwinDeployment, Operations }