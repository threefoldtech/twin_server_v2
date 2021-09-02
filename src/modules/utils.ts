import { TFClient, MessageBusClient, Deployment } from "grid3_client"
import { default as config } from "../../config.json"
import { getNodeTwinId } from "../primitives/nodes"

async function createContractAndSendToZos(deployment: Deployment, node_id: number, hash: string, publicIPs: number) {
    const tfclient = new TFClient(config.url, config.mnemonic)
    await tfclient.connect()
    const contract = await tfclient.contracts.create(node_id, hash, "", publicIPs)
    if (contract instanceof (Error)) {
        throw Error(`Failed to create contract ${contract}`)
    }
    console.log(contract)
    deployment.contract_id = contract["contract_id"]
    const payload = JSON.stringify(deployment);
    const node_twin_id = await getNodeTwinId(node_id)
    try {
        let rmb = new MessageBusClient();
        let msg = rmb.prepare("zos.deployment.deploy", [node_twin_id], 0, 2);
        rmb.send(msg, payload)
        const result = await rmb.read(msg)
        if (result[0].err) {
            throw Error(result[0].err);
        }
    }
    catch (err) {
        await tfclient.contracts.cancel(contract["contract_id"])
        throw Error(err)
    }
    finally {
        tfclient.disconnect()
    }
    return contract
}
export { createContractAndSendToZos }