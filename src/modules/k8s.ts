import { WorkloadTypes } from "grid3_client"

import { K8S } from "./models"
import { expose } from "../helpers/index";
import { DeploymentFactory } from "../high_level/deploymentFactory";
import { Kubernetes } from "../high_level/kubernetes"
import { Network } from "../primitives/network";
import { getAccessNodes } from "../primitives/nodes"

const ipRange = "10.200.0.0/16"

class K8s {
    @expose
    async deploy(options: K8S) {
        if (options.node_ids.length < options.workers + 1) {
            throw Error(`Number of nodes specified less than the required number for deploying 1 master and ${options.workers} workers`)
        }

        const networkName = `${options.name}_k8s_network`;
        let network = new Network(networkName, ipRange)
        await network.load(true)
        if (network.exists()) {
            throw Error(`A kubernetes cluster with same name ${options.name} already exists`)
        }

        let masterNodeId = 0;
        const accessNodes = await getAccessNodes()
        for (const accessNode of Object.keys(accessNodes)) {
            if (options.node_ids.includes(Number(accessNode))) {
                masterNodeId = Number(accessNode)
                break;
            }
        }

        if (!masterNodeId) {
            masterNodeId = options.node_ids.pop()
        }
        const workerNodeIds = options.node_ids.filter(id => id !== masterNodeId)

        let deployments = []
        const kubernetes = new Kubernetes()
        const [twinDeployments, wgConfig] = await kubernetes.add_master(masterNodeId,
            options.secret,
            options.cpu,
            options.memory,
            options.disk_size,
            options.public_ip,
            network,
            options.ssh_key,
            options.metadata,
            options.description)

        let masterIp = ""
        for (const twinDeployment of twinDeployments) {
            for (const workload of twinDeployment.deployment.workloads) {
                if (workload.type === WorkloadTypes.zmachine) {
                    masterIp = workload.data["network"]["interfaces"][0]["ip"]
                    break
                }
            }
        }

        deployments = twinDeployments

        for (let i = 0; i < options.workers; i++) {
            const [twinDeployments, _] = await kubernetes.add_worker(workerNodeIds[i],
                options.secret,
                masterIp,
                options.cpu,
                options.memory,
                options.disk_size,
                false,
                network,
                options.ssh_key,
                options.metadata,
                options.description)

            deployments = deployments.concat(twinDeployments)
        }
        let deploymentFactory = new DeploymentFactory()
        const contracts = await deploymentFactory.handle(deployments, network)

        return { "contracts": contracts, "wireguard_config": wgConfig }
    }
}

export { K8s as k8s }