import { TFClient, WorkloadTypes, Deployment, MessageBusClient } from "grid3_client"

import { TwinDeployment } from "./models";
import { Network, getNodeTwinId } from "../primitives/index";
import { default as config } from "../../config.json"


class DeploymentFactory {
    tfclient: TFClient;
    rmb: MessageBusClient;

    constructor() {
        this.tfclient = new TFClient(config.url, config.mnemonic)
        this.rmb = new MessageBusClient();
    }

    async createContractAndSendToZos(deployment: Deployment, node_id: number, hash: string, publicIPs: number) {
        await this.tfclient.connect()
        const contract = await this.tfclient.contracts.create(node_id, hash, "", publicIPs)
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

    async deploy(deployments: TwinDeployment[], network: Network) {
        let contracts = []
        for (let twinDeployment of deployments) {
            for (let workload of twinDeployment.deployment.workloads) {
                if (workload.type === WorkloadTypes.network) {
                    workload["data"] = network.updateNetwork(workload.data);
                }
            }
            const contract = await this.createContractAndSendToZos(twinDeployment.deployment,
                twinDeployment.nodeId,
                twinDeployment.hash,
                twinDeployment.publicIPs)
            await network.save(contract["contract_id"], twinDeployment.nodeId)
            contracts.push(contract)
        }
        return contracts
    }
}

export { DeploymentFactory }