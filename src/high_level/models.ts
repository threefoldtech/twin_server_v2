import { Deployment } from "grid3_client"
import { Network } from "../primitives/network"


enum Operations {
    deploy = "deploy",
    update = "update",
    delete = "delete"
}

class TwinDeployment {
    constructor(public deployment: Deployment,
        public operation: Operations,
        public publicIps: number,
        public nodeId: number,
        public network: Network = null
    ) {
        this.deployment = deployment;
        this.operation = operation;
        this.publicIps = publicIps;
        this.nodeId = nodeId;
        this.network = network;
    }
}

export { TwinDeployment, Operations }