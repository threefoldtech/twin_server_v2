import { WorkloadTypes } from "grid3_client"

import { expose } from "../helpers/index"
import { default as config } from "../../config.json"
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler"
import { DeploymentFactory } from "../primitives/deployment"

class Zos {
    @expose
    async deploy(options) {
        // get node_id from the deployment
        const node_id = options.node_id
        delete options.node_id

        const deploymentFactory = new DeploymentFactory()
        let deployment = deploymentFactory.fromObj(options)
        deployment.sign(deployment.twin_id, config.mnemonic)

        let publicIps = 0;
        for (const workload of deployment.workloads) {
            if (workload.type === WorkloadTypes.ipv4) {
                publicIps++;
            }
        }
        let twinDeploymentHandler = new TwinDeploymentHandler()
        return await twinDeploymentHandler.deploy(deployment, node_id, publicIps)
    }
}

export { Zos as zos }
