import { Deployment, WorkloadTypes, TFClient, Workload } from "grid3_client"
import { Addr } from "netaddr"

import { DeploymentFactory } from "../primitives/deployment"
import { Network } from "../primitives/network"
import { TwinDeployment, Operations } from "../high_level/models"
import { default as config } from "../../config.json"


class HighLevelBase {

    _filterWorkloads(deployment: Deployment,
        names: string[],
        types: WorkloadTypes[] = [WorkloadTypes.ipv4, WorkloadTypes.zmachine, WorkloadTypes.zmount, WorkloadTypes.zdb]
    ) {

        let deletedMachineWorkloads = []
        if (names.length === 0) {
            deletedMachineWorkloads = deployment.workloads.filter(item => item.type === WorkloadTypes.zmachine)
        }

        if (names.length !== 0 && types.includes(WorkloadTypes.zmachine)) {
            const Workloads = deployment.workloads.filter(item => item.type === WorkloadTypes.zmachine)
            for (const workload of Workloads) {
                if (!names.includes(workload.name)) {
                    continue
                }
                for (const mount of workload.data["mounts"]) {
                    names.push(mount.name)
                }
                names.push(workload.data["network"].public_ip)
                deletedMachineWorkloads.push(workload)
            }
        }

        let remainingWorkloads = []
        for (const workload of deployment.workloads) {
            if (workload.type === WorkloadTypes.network) {
                remainingWorkloads.push(workload)
                continue
            }
            if (!types.includes(workload.type)) {
                remainingWorkloads.push(workload)
                continue
            }
            if (names.length !== 0 && !names.includes(workload.name)) {
                remainingWorkloads.push(workload)
            }

        }
        return [remainingWorkloads, deletedMachineWorkloads]
    }

    async _deleteMachineNetwork(deployment: Deployment,
        remainingWorkloads: Workload[],
        deletedMachineWorkloads: Workload[],
        node_id: number
    ) {
        let twinDeployments = []
        const deploymentFactory = new DeploymentFactory()
        for (const workload of deletedMachineWorkloads) {
            const networkName = workload.data["network"].interfaces[0].network
            const networkIpRange = Addr(workload.data["network"].interfaces[0].ip).mask(16).toString()
            let network = new Network(networkName, networkIpRange)
            await network.load(true)

            network.deleteReservedIp(node_id, workload.data["network"].interfaces[0].ip)
            if (network.getNodeReservedIps(node_id).length !== 0) {
                continue
            }
            if (network.hasAccessPoint(node_id) && network.nodes.length !== 1) {
                continue
            }

            const contract_id = network.deleteNode(node_id)
            if (contract_id === deployment.contract_id) {
                if (remainingWorkloads.length === 1) {
                    twinDeployments.push(new TwinDeployment(deployment, Operations.delete, 0, 0))
                    remainingWorkloads = []
                }
                else {
                    remainingWorkloads = remainingWorkloads.filter(item => item.name !== networkName)
                }
            }
            else {
                // check that the deployment doesn't have another workloads
                for (let d of network.deployments) {
                    d = deploymentFactory.fromObj(d)
                    if (d.contract_id !== contract_id) {
                        continue
                    }
                    if (d.workloads.length === 1) {
                        twinDeployments.push(new TwinDeployment(d, Operations.delete, 0, 0))
                    }
                    else {
                        d.workloads = d.workloads.filter(item => item.name !== networkName)
                        twinDeployments.push(new TwinDeployment(d, Operations.update, 0, 0))
                    }
                }
            }
            // in case of the network got more accesspoints on different nodes this won't be valid
            if (network.nodes.length === 1 && network.getNodeReservedIps(network.nodes[0].node_id).length === 0) {
                network.deleteNode(network.nodes[0].node_id)
                let d = deploymentFactory.fromObj(network.deployments[0])
                if (d.workloads.length === 1) {
                    twinDeployments.push(new TwinDeployment(d, Operations.delete, 0, 0))
                }
                else {
                    d.workloads = d.workloads.filter(item => item.name !== networkName)
                    twinDeployments.push(new TwinDeployment(d, Operations.update, 0, 0))
                }
            }
        }
        return [twinDeployments, remainingWorkloads]
    }

    async _delete(deployment: Deployment,
        names: string[],
        types: WorkloadTypes[] = [WorkloadTypes.ipv4, WorkloadTypes.zmachine, WorkloadTypes.zmount, WorkloadTypes.zdb]
    ): Promise<TwinDeployment[]> {

        if (types.includes(WorkloadTypes.network)) {
            throw Error("network can't be deleted")
        }

        const tfclient = new TFClient(config.url, config.mnemonic)
        await tfclient.connect()
        let twinDeployments = []

        const deploymentFactory = new DeploymentFactory()
        const contract = await tfclient.contracts.get(deployment.contract_id)
        const node_id = contract["node_id"]
        const numberOfWorkloads = deployment.workloads.length
        deployment = deploymentFactory.fromObj(deployment)
        let [remainingWorkloads, deletedMachineWorkloads] = this._filterWorkloads(deployment, names, types)

        if (remainingWorkloads.length === 0) {
            twinDeployments.push(new TwinDeployment(deployment, Operations.delete, 0, 0))
        }
        let [newTwinDeployments, newRemainingWorkloads] = await this._deleteMachineNetwork(deployment, remainingWorkloads, deletedMachineWorkloads, node_id)
        twinDeployments = twinDeployments.concat(newTwinDeployments)
        remainingWorkloads = newRemainingWorkloads

        if (remainingWorkloads.length !== 0 && remainingWorkloads.length < numberOfWorkloads) {
            deployment.workloads = remainingWorkloads
            twinDeployments.push(new TwinDeployment(deployment, Operations.update, 0, 0))
        }
        return twinDeployments
    }
}

export { HighLevelBase }