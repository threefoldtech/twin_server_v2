import { TFClient, WorkloadTypes, Deployment, MessageBusClient } from "grid3_client"

import { Operations, TwinDeployment } from "./models";
import { Network, getNodeTwinId } from "../primitives/index";
import { default as config } from "../../config.json"


class TwinDeploymentHandler {
    tfclient: TFClient;
    rmb: MessageBusClient;

    constructor() {
        this.tfclient = new TFClient(config.url, config.mnemonic)
        this.rmb = new MessageBusClient();
    }

    async deploy(deployment: Deployment, node_id: number, publicIps: number) {
        await this.tfclient.connect()
        const contract = await this.tfclient.contracts.create(node_id, deployment.challenge_hash(), "", publicIps)
        if (contract instanceof (Error)) {
            throw Error(`Failed to create contract ${contract}`)
        }
        console.log(contract)
        deployment.contract_id = contract["contract_id"]
        const payload = JSON.stringify(deployment);
        const node_twin_id = await getNodeTwinId(node_id)
        try {
            let msg = this.rmb.prepare("zos.deployment.deploy", [node_twin_id], 0, 2);
            this.rmb.send(msg, payload)
            const result = await this.rmb.read(msg)
            if (result[0].err) {
                throw Error(result[0].err);
            }
        }
        catch (err) {
            await this.tfclient.contracts.cancel(contract["contract_id"])
            throw Error(err)
        }
        finally {
            this.tfclient.disconnect()
        }
        return contract
    }

    async update(deployment: Deployment, publicIps: number) {
        // TODO: update the contract with public when it is available 
        await this.tfclient.connect()
        const contract = await this.tfclient.contracts.update(deployment.contract_id, "", deployment.challenge_hash())
        if (contract instanceof (Error)) {
            throw Error(`Failed to update contract ${contract}`)
        }
        console.log(contract)

        const payload = JSON.stringify(deployment);
        const node_twin_id = await getNodeTwinId(contract["node_id"])
        try {
            let msg = this.rmb.prepare("zos.deployment.update", [node_twin_id], 0, 2);
            this.rmb.send(msg, payload)
            const result = await this.rmb.read(msg)
            if (result[0].err) {
                throw Error(result[0].err);
            }
        }
        catch (err) {
            throw Error(err)
        }
        finally {
            this.tfclient.disconnect()
        }
        return contract
    }

    deployMerge(twinDeployments: TwinDeployment[]): TwinDeployment[] {
        let deploymentMap = {}
        for (let twinDeployment of twinDeployments) {
            if (twinDeployment.operation !== Operations.deploy) {
                continue
            }
            if (Object.keys(deploymentMap).includes(twinDeployment.nodeId.toString())) {
                deploymentMap[twinDeployment.nodeId].deployment.workloads = deploymentMap[twinDeployment.nodeId].deployment.workloads.concat(twinDeployment.deployment.workloads)
                deploymentMap[twinDeployment.nodeId].publicIps += twinDeployment.publicIps
            }
            else {
                deploymentMap[twinDeployment.nodeId] = twinDeployment
            }
        }

        let deployments = []
        for (let key of Object.keys(deploymentMap)) {
            deployments.push(deploymentMap[key])
        }
        return deployments
    }

    async delete(contract_id: number): Promise<number> {
        const tfclient = new TFClient(config.url, config.mnemonic)
        await tfclient.connect()
        try {
            await tfclient.contracts.cancel(contract_id);
        }
        catch (err) {
            throw Error(`Failed to cancel contract ${contract_id} due to: ${err}`)
        }
        finally {
            tfclient.disconnect()
        }
        return contract_id
    }

    _updateToLatest(twinDeployments: TwinDeployment[]): TwinDeployment {
        // all deployment pass should be with the same contract id to merge them to one deployment with all updates
        if (twinDeployments.length === 0) {
            return
        }
        else if (twinDeployments.length === 1) {
            twinDeployments[0].deployment.version += 1
            return twinDeployments[0]
        }

        let workloadMap = {}
        let publicIps = 0
        let network = null
        for (const twinDeployment of twinDeployments) {
            for (const workload of twinDeployment.deployment.workloads) {
                if (workloadMap.hasOwnProperty(workload.name)) {
                    workloadMap[workload.name].push(workload)
                }
                else {
                    workloadMap[workload.name] = [workload]
                }
            }
            publicIps += twinDeployment.publicIps
            if (!network && twinDeployment.network) {
                network = twinDeployment.network
            }
        }

        let workloads = []
        for (const name of Object.keys(workloadMap)) {
            let w = workloadMap[name][0]
            if (workloadMap[name].length < twinDeployments.length && w.version <= twinDeployments[0].deployment.version) {
                continue
            }
            for (const workload of workloadMap[name]) {
                if (w.version < workload.version) {
                    w = workload
                }
            }
            workloads.push(w)
        }
        let d = twinDeployments[0]
        d.deployment.workloads = workloads
        d.publicIps = publicIps
        d.network = network
        d.deployment.version += 1
        return d

    }

    updateMerge(twinDeployments: TwinDeployment[]): TwinDeployment[] {
        let deploymentMap = {}
        for (let twinDeployment of twinDeployments) {
            if (twinDeployment.operation !== Operations.update) {
                continue
            }
            if (deploymentMap.hasOwnProperty(twinDeployment.deployment.contract_id)) {
                deploymentMap[twinDeployment.deployment.contract_id].push(twinDeployment)
            }
            else {
                deploymentMap[twinDeployment.deployment.contract_id] = [twinDeployment]
            }
        }
        let deployments = []
        for (let key of Object.keys(deploymentMap)) {
            deployments.push(this._updateToLatest(deploymentMap[key]))
        }
        return deployments
    }

    merge(twinDeployments: TwinDeployment[]): TwinDeployment[] {
        let deployments = []
        deployments = deployments.concat(this.deployMerge(twinDeployments))
        let deletedDeployments = twinDeployments.filter(d => d.operation === Operations.delete)
        let deletedContracts = []
        for (const d of deletedDeployments) {
            deletedContracts.push(d.deployment.contract_id)
        }
        let updatedDeployment = this.updateMerge(twinDeployments)
        deployments = deployments.concat(updatedDeployment.filter(d => !deletedContracts.includes(d.deployment.contract_id)))
        deployments = deployments.concat(deletedDeployments)
        return deployments
    }

    async handle(twinDeployments: TwinDeployment[]) {
        twinDeployments = this.merge(twinDeployments)
        let contracts = { "created": [], "updated": [], "deleted": [] }
        for (let twinDeployment of twinDeployments) {
            for (let workload of twinDeployment.deployment.workloads) {
                if (!twinDeployment.network) {
                    break
                }
                if (workload.type === WorkloadTypes.network) {
                    workload["data"] = twinDeployment.network.updateNetwork(workload.data);
                }
            }
            twinDeployment.deployment.sign(config.twin_id, config.mnemonic)
            if (twinDeployment.operation === Operations.deploy) {
                const contract = await this.deploy(twinDeployment.deployment,
                    twinDeployment.nodeId,
                    twinDeployment.publicIps)
                contracts.created.push(contract)
                if (twinDeployment.network) {
                    await twinDeployment.network.save(contract["contract_id"], contract["node_id"])
                }
            }
            else if (twinDeployment.operation === Operations.update) {
                const contract = await this.update(twinDeployment.deployment, twinDeployment.publicIps)
                contracts.updated.push(contract)
                if (twinDeployment.network) {
                    await twinDeployment.network.save(contract["contract_id"], contract["node_id"])
                }
            }
            else if (twinDeployment.operation === Operations.delete) {
                const contract = await this.delete(twinDeployment.deployment.contract_id)
                contracts.deleted.push({ "contract_id": contract })
            }
        }
        return contracts
    }
}

export { TwinDeploymentHandler }