import { WorkloadTypes } from "grid3_client"

import { K8S } from "./models"
import { BaseModule } from "./base"
import { expose } from "../helpers/index";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { Kubernetes } from "../high_level/kubernetes"
import { Network } from "../primitives/network";

const ipRange = "10.200.0.0/16"

class K8s extends BaseModule {
    fileName: string = "kubernetes.json";

    @expose
    async deploy(options: K8S) {
        if (options.masters.length > 1) {
            throw Error("Multi master is not supported")
        }

        if (this.exists(options.name)) {
            throw Error(`Another k8s deployment with the same name ${options.name} is already exist`)
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
            const [twinDeployments, wgConfig] = await kubernetes.add_master(master.name,
                master.node_id,
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
            const [twinDeployments, _] = await kubernetes.add_worker(worker.name,
                worker.node_id,
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
        let twinDeploymentHandler = new TwinDeploymentHandler()
        const contracts = await twinDeploymentHandler.handle(deployments, network)
        const data = this.save(options.name, contracts, wireguardConfig)
        return data
    }

    @expose
    list() {
        return this._list()
    }

    @expose
    async get(options) {
        return await this._get(options.name)
    }

    @expose
    async delete(options) {
        return await this._delete(options.name)
    }
}

export { K8s as k8s }