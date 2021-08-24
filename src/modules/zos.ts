import { expose } from "../helpers/expose"
import { Deployment, TFClient, PublicIP, WorkloadTypes, MessageBusClient } from "grid3_client"
import { default as config } from "../../config.json"


class Zos {
    @expose
    async deploy(options) {
        // get challenge hash for the deployment
        const jsonObj = JSON.parse(options)
        const hash = jsonObj.hash
        const node_id = jsonObj.node_id
        const node_twin_id = jsonObj.node_twin_id
        delete jsonObj.hash
        delete jsonObj.node_id
        delete jsonObj.node_twin_id

        let deployment = new Deployment()
        Object.assign(deployment, jsonObj)
        let publicIPs = 0;
        for (let i = 0; i < deployment.workloads.length; i++) {
            if (deployment.workloads[i].type === WorkloadTypes.ipv4) {
                publicIPs++;
            }
        }
        const tfclient = new TFClient(config.url, config.mnemonic)
        tfclient.connect()
        const contract_id = await tfclient.contracts.create(node_id, hash, "", publicIPs)
        if (contract_id instanceof (Error)) {
            return contract_id
        }
        deployment.contract_id = contract_id
        deployment.sign(deployment.twin_id, config.mnemonic, hash)
        const payload = JSON.stringify(deployment);

        let rmb = new MessageBusClient();
        let msg = rmb.prepare("zos.deployment.deploy", [node_twin_id], 0, 2);
        rmb.send(msg, payload)
        const result = await rmb.read(msg)
        if (result[0].err) {
            return result[0].err;
        }
        return contract_id
    }
}
export { Zos as zos }