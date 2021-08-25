import { expose } from "../helpers/expose"
import { Deployment, TFClient, WorkloadTypes, MessageBusClient } from "grid3_client"
import { default as config } from "../../config.json"


class Zos {
    @expose
    async deploy(options) {
        // get challenge hash, node_id, and node_twin_id from the deployment
        const hash = options.hash
        const node_id = options.node_id
        const node_twin_id = options.node_twin_id
        delete options.hash
        delete options.node_id
        delete options.node_twin_id

        let deployment = new Deployment()
        Object.assign(deployment, options)
        let publicIPs = 0;
        for (let i = 0; i < deployment.workloads.length; i++) {
            if (deployment.workloads[i].type === WorkloadTypes.ipv4) {
                publicIPs++;
            }
        }
        const tfclient = new TFClient(config.url, config.mnemonic)
        await tfclient.connect()
        const contract = await tfclient.contracts.create(node_id, hash, "", publicIPs)
        if (contract instanceof (Error)) {
            throw Error(`Failed to create contract ${contract}`)
        }
        console.log(contract)
        deployment.contract_id = contract["contract_id"]
        deployment.sign(deployment.twin_id, config.mnemonic, hash)
        const payload = JSON.stringify(deployment);

        let rmb = new MessageBusClient();
        let msg = rmb.prepare("zos.deployment.deploy", [node_twin_id], 0, 2);
        rmb.send(msg, payload)
        const result = await rmb.read(msg)
        if (result[0].err) {
            throw Error(result[0].err);
        }
        return contract
    }
}

export { Zos as zos }