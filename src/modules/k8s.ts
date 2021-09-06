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
        if (options.masters.length > 1) {
            throw Error("Multi master is not supported")
        }

        const networkName = `${options.name}_k8s_network`;
        let network = new Network(networkName, ipRange)
        await network.load(true)
        if (network.exists()) {
            throw Error(`A kubernetes cluster with same name ${options.name} already exists`)
        }

        let deployments = []
        let wireguardConfig = ""
        const kubernetes = new Kubernetes()

        for (const master of options.masters) {
            const [twinDeployments, wgConfig] = await kubernetes.add_master(master.node_id,
                options.secret,
                master.cpu,
                master.memory,
                master.disk_size,
                master.public_ip,
                network,
                options.ssh_key,
                options.metadata,
                options.description)

            deployments = deployments.concat(twinDeployments)
            if (wgConfig) {
                wireguardConfig = wgConfig
            }
        }

        let masterIp = ""
        for (const twinDeployment of deployments) {
            for (const workload of twinDeployment.deployment.workloads) {
                if (workload.type === WorkloadTypes.zmachine) {
                    masterIp = workload.data["network"]["interfaces"][0]["ip"]
                    break
                }
            }
        }

        for (const worker of options.workers) {
            const [twinDeployments, _] = await kubernetes.add_worker(worker.node_id,
                options.secret,
                masterIp,
                worker.cpu,
                worker.memory,
                worker.disk_size,
                worker.public_ip,
                network,
                options.ssh_key,
                options.metadata,
                options.description)

            deployments = deployments.concat(twinDeployments)
        }
        let deploymentFactory = new DeploymentFactory()
        const contracts = await deploymentFactory.handle(deployments, network)

        return { "contracts": contracts, "wireguard_config": wireguardConfig }
    }
}

export { K8s as k8s }