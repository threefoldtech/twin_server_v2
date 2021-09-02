import { expose } from "../helpers/expose"
import { Deployment, TFClient, WorkloadTypes, MessageBusClient } from "grid3_client"
import { default as config } from "../../config.json"
import { createContractAndSendToZos } from "./utils"


class Zos {
    @expose
    async deploy(options) {
        // get challenge hash, node_id, and node_twin_id from the deployment
        const deploymentHash = options.hash
        const node_id = options.node_id
        const node_twin_id = options.node_twin_id
        delete options.hash
        delete options.node_id
        delete options.node_twin_id

        let deployment = new Deployment()
        Object.assign(deployment, options)
        deployment.sign(deployment.twin_id, config.mnemonic, deploymentHash)

        let publicIPs = 0;
        for (let i = 0; i < deployment.workloads.length; i++) {
            if (deployment.workloads[i].type === WorkloadTypes.ipv4) {
                publicIPs++;
            }
        }
        return await createContractAndSendToZos(deployment, node_id, deploymentHash, publicIPs)
    }
}

export { Zos as zos }
