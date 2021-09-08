import * as PATH from "path"

import { MessageBusClient, TFClient } from "grid3_client"

import { loadFromFile, updatejson, appPath } from "../helpers/jsonfs"
import { getNodeTwinId } from "../primitives/nodes";
import { default as config } from "../../config.json"


class BaseModule {
    fileName: string = "";

    save(name: string, contracts: Object[], wgConfig: string = "") {
        let contractIds = []
        for (const contract of contracts) {
            contractIds.push({ "contract_id": contract["contract_id"], "node_id": contract["node_id"] })
        }
        let data = { "contracts": contractIds }
        if (wgConfig) {
            data["wireguard_config"] = wgConfig
        }
        const path = PATH.join(appPath, this.fileName)
        updatejson(path, name, data)

        return data
    }

    async _get(name) {
        const path = PATH.join(appPath, this.fileName)
        const data = loadFromFile(path)
        console.log(name)
        console.log(data)
        if (!data.hasOwnProperty(name)) {
            return []
        }
        let deployments = []
        const rmb = new MessageBusClient();
        for (const contract of data[name]["contracts"]) {
            const node_twin_id = await getNodeTwinId(contract["node_id"])
            const payload = JSON.stringify({ "contract_id": contract["contract_id"] });

            let msg = rmb.prepare("zos.deployment.get", [node_twin_id], 0, 2);
            rmb.send(msg, payload)
            const result = await rmb.read(msg)
            if (result[0].err) {
                throw Error(result[0].err);
            }
            deployments.push(JSON.parse(result[0].dat))
        }
        return deployments
    }

    async _delete(name) {
        const path = PATH.join(appPath, this.fileName)
        const data = loadFromFile(path)
        if (!data.hasOwnProperty(name)) {
            return []
        }

        const tfclient = new TFClient(config.url, config.mnemonic)
        await tfclient.connect()
        let contracts = []
        for (const contract of data[name]["contracts"]) {
            try {
                await tfclient.contracts.cancel(contract["contract_id"]);
                contracts.push(contract["contract_id"])
            }
            catch (err) {
                throw Error(`Failed to cancel contract ${contract["contract_id"]} due to: ${err}`)
            }
        }
        updatejson(path, name, "", "delete")
        return contracts
    }
}
export { BaseModule }
