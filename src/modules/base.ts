import * as PATH from "path"

import { MessageBusClient } from "grid3_client"

import { HighLevelBase } from "../high_level/base";
import { loadFromFile, updatejson, appPath } from "../helpers/jsonfs"
import { getNodeTwinId } from "../primitives/nodes";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler"


class BaseModule {
    fileName: string = "";

    save(name: string, contracts: Object, wgConfig: string = "") {
        const path = PATH.join(appPath, this.fileName)
        const data = loadFromFile(path)
        let deploymentData = { "contracts": [], "wireguard_config": "" }
        if (data.hasOwnProperty(name)) {
            deploymentData = data[name]
        }

        for (const contract of contracts["created"]) {
            deploymentData.contracts.push({ "contract_id": contract["contract_id"], "node_id": contract["node_id"] })
        }
        for (const contract of contracts["deleted"]) {
            deploymentData.contracts = deploymentData.contracts.filter(c => c["contract_id"] !== contract["contract_id"])
        }
        if (wgConfig) {
            deploymentData["wireguard_config"] = wgConfig
        }
        updatejson(path, name, deploymentData)
        return deploymentData
    }

    _list() {
        const path = PATH.join(appPath, this.fileName)
        const data = loadFromFile(path)
        return Object.keys(data)
    }

    exists(name) {
        return this._list().includes(name)
    }

    _getDeploymentNodeIds(name) {
        let nodeIds = []
        const contracts = this._getContracts(name)
        for (const contract of contracts) {
            nodeIds.push(contract["node_id"])
        }
        return nodeIds
    }

    _getContracts(name) {
        const path = PATH.join(appPath, this.fileName)
        const data = loadFromFile(path)
        if (!data.hasOwnProperty(name)) {
            return []
        }
        return data[name]["contracts"]
    }

    _getContractIdFromNodeId(name, nodeId) {
        const contracts = this._getContracts(name)
        for (const contract of contracts) {
            if (contract["node_id"] === nodeId) {
                return contract["contract_id"]
            }
        }
    }
    _getNodeIdFromContractId(name, contractId) {
        const contracts = this._getContracts(name)
        for (const contract of contracts) {
            if (contract["contract_id"] === contractId) {
                return contract["node_id"]
            }
        }
    }

    async _get(name: string) {
        const path = PATH.join(appPath, this.fileName)
        const data = loadFromFile(path)
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

    async _delete(name: string) {
        const path = PATH.join(appPath, this.fileName)
        const data = loadFromFile(path)
        if (!data.hasOwnProperty(name)) {
            return []
        }
        let contracts = { "deleted": [], "updated": [] }
        let twinDeploymentHandler = new TwinDeploymentHandler()
        const deployments = await this._get(name)
        const highlvl = new HighLevelBase
        for (let deployment of deployments) {
            const twinDeployments = await highlvl._delete(deployment, [])
            const contract = await twinDeploymentHandler.handle(twinDeployments)
            contracts.deleted = contracts.deleted.concat(contract["deleted"])
            contracts.updated = contracts.updated.concat(contract["updated"])
        }
        let deletedContracts = []
        for (const c of contracts.deleted) {
            deletedContracts.push(c["contract_id"])
        }
        let updatedContracts = []
        for (const c of contracts.updated) {
            if (!deletedContracts.includes(c["contract_id"])) {
                updatedContracts.push(c)
            }
        }
        contracts.updated = updatedContracts
        updatejson(path, name, "", "delete")
        return contracts
    }
}
export { BaseModule }
