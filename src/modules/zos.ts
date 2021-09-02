import { Deployment, WorkloadTypes } from "grid3_client"

import { expose } from "../helpers/index"
import { default as config } from "../../config.json"
import { DeploymentFactory } from "../high_level/deploymentFactory"

class Zos {
    @expose
    async deploy(options) {
        // get challenge hash, node_id, and node_twin_id from the deployment
        const deploymentHash = options.hash
        const node_id = options.node_id
        delete options.hash
        delete options.node_id

        let deployment = new Deployment()
        Object.assign(deployment, options)
        deployment.sign(deployment.twin_id, config.mnemonic, deploymentHash)

        let publicIPs = 0;
        for (const workload of deployment.workloads) {
            if (workload.type === WorkloadTypes.ipv4) {
                publicIPs++;
            }
        }
        let deploymentFactory = new DeploymentFactory()
        return await deploymentFactory.createContractAndSendToZos(deployment, node_id, deploymentHash, publicIPs)
    }
}

export { Zos as zos }
