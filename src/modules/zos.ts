import { WorkloadTypes } from "grid3_client"

import { expose } from "../helpers/index"
import { default as config } from "../../config.json"
import { TwinDeploymentFactory } from "../high_level/twinDeploymentFactory"
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

        let publicIPs = 0;
        for (const workload of deployment.workloads) {
            if (workload.type === WorkloadTypes.ipv4) {
                publicIPs++;
            }
        }
        let twinDeploymentFactory = new TwinDeploymentFactory()
        return await twinDeploymentFactory.createContractAndSendToZos(deployment, node_id, deployment.challenge_hash(), publicIPs)
    }
}

export { Zos as zos }
