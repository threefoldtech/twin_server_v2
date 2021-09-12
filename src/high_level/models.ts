import { Deployment } from "grid3_client"


enum Operations {
    deploy = "deploy",
    update = "update"
}

class TwinDeployment {
    constructor(public deployment: Deployment, public operation: Operations, public publicIps: number, public nodeId: number) {
        this.deployment = deployment;
        this.operation = operation;
        this.publicIps = publicIps;
        this.nodeId = nodeId;
    }
}

export { TwinDeployment, Operations }