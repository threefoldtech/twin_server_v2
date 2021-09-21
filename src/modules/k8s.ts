import { Deployment, Workload, WorkloadTypes } from "grid3_client"
import { Addr } from "netaddr"

import { AddWorker, DeleteWorker, K8S } from "./models"
import { BaseModule } from "./base"
import { expose } from "../helpers/index";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { TwinDeployment, Operations } from "../high_level/models"
import { Kubernetes } from "../high_level/kubernetes"
import { Network } from "../primitives/network";
import { DeploymentFactory } from "../primitives/deployment"


class K8s extends BaseModule {
    fileName: string = "kubernetes.json";

    _getMastersWorkload(deployments): Workload[] {
        let workloads = []
        for (const deployment of deployments) {
            let d = deployment
            if (deployment instanceof TwinDeployment) {
                d = deployment.deployment
            }
            for (const workload of d.workloads) {
                if (workload.type === WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] === "") {
                    workloads.push(workload)
                }
            }
        }
        return workloads
    }

    _getMastersIp(deployments): string[] {
        let ips = []
        const workloads = this._getMastersWorkload(deployments)
        for (const workload of workloads) {
            ips.push(workload.data["network"]["interfaces"][0]["ip"])
        }
        return ips
    }

    @expose
    async deploy(options: K8S) {
        if (options.masters.length > 1) {
            throw Error("Multi master is not supported")
        }

        if (this.exists(options.name)) {
            throw Error(`Another k8s deployment with the same name ${options.name} is already exist`)
        }

        let network = new Network(options.network.name, options.network.ip_range)
        await network.load(true)

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

        const masterIps = this._getMastersIp(deployments)
        if (masterIps.length === 0) {
            throw Error("Couldn't get master ip")
        }

        for (const worker of options.workers) {
            const [twinDeployments, _] = await kubernetes.add_worker(worker.name,
                worker.node_id,
                options.secret,
                masterIps[0],
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
        const contracts = await twinDeploymentHandler.handle(deployments)
        this.save(options.name, contracts, wireguardConfig)
        return { "contracts": contracts, "wireguard_config": wireguardConfig }
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

    @expose
    async update(options: K8S) {
        if (!this.exists(options.name)) {
            throw Error(`There is no k8s deployment with name: ${options.name}`)
        }
        if (options.masters.length > 1) {
            throw Error("Multi master is not supported")
        }
        let deploymentObjs = await this._get(options.name)
        for (const workload of deploymentObjs[0].workloads) {
            if (workload.type !== WorkloadTypes.network) {
                continue
            }
            if (workload.name !== options.network.name) {
                throw Error("Network name can't be changed")
            }
        }

        const masterIps = this._getMastersIp(deploymentObjs)
        if (masterIps.length === 0) {
            throw Error("Couldn't get master ip")
        }

        const networkName = options.network.name;
        let network = new Network(networkName, options.network.ip_range)
        await network.load(true)

        //TODO: check that the master nodes are not changed
        let twinDeployments = []
        const kubernetes = new Kubernetes()
        for (const master of options.masters) {
            const [TDeployments, _] = await kubernetes.add_master(master.name,
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

            twinDeployments = twinDeployments.concat(TDeployments)
        }
        for (const worker of options.workers) {
            const [TDeployments, _] = await kubernetes.add_worker(worker.name,
                worker.node_id,
                options.secret,
                masterIps[0],
                worker.cpu,
                worker.memory,
                worker.disk_size,
                worker.public_ip,
                network,
                options.ssh_key,
                options.metadata,
                options.description)

            twinDeployments = twinDeployments.concat(TDeployments)

        }
        let deploymentFactory = new DeploymentFactory();
        let twinDeploymentHandler = new TwinDeploymentHandler()
        let finalTwinDeployments = []
        finalTwinDeployments = twinDeployments.filter(d => d.operation === Operations.update)
        twinDeployments = twinDeploymentHandler.deployMerge(twinDeployments)
        const deploymentNodeIds = this._getDeploymentNodeIds(options.name)
        finalTwinDeployments = finalTwinDeployments.concat(twinDeployments.filter(d => !deploymentNodeIds.includes(d.nodeId)))

        for (const deploymentObj of deploymentObjs) {
            let oldDeployment = deploymentFactory.fromObj(deploymentObj)
            const node_id = this._getNodeIdFromContractId(options.name, oldDeployment.contract_id)
            let deploymentFound = false
            for (const twinDeployment of twinDeployments) {
                if (twinDeployment.nodeId !== node_id) {
                    continue
                }
                oldDeployment = await deploymentFactory.UpdateDeployment(oldDeployment, twinDeployment.deployment, network)
                deploymentFound = true
                if (!oldDeployment) {
                    continue
                }
                finalTwinDeployments.push(new TwinDeployment(oldDeployment, Operations.update, 0, 0, network))
                break
            }
            if (!deploymentFound) {
                const tDeployments = await kubernetes.deleteNode(oldDeployment, [])
                finalTwinDeployments = finalTwinDeployments.concat(tDeployments)
            }
        }
        const contracts = await twinDeploymentHandler.handle(finalTwinDeployments)
        if (contracts.created.length === 0 && contracts.updated.length === 0 && contracts.deleted.length === 0) {
            return "Nothing found to update"
        }
        this.save(options.name, contracts)
        return { "contracts": contracts }
    }

    @expose
    async add_worker(options: AddWorker) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no k8s deployment with name: ${options.deployment_name}`)
        }
        let deploymentObjs = await this._get(options.deployment_name)
        const kubernetes = new Kubernetes()
        const masterWorkloads = this._getMastersWorkload(deploymentObjs)
        if (masterWorkloads.length === 0) {
            throw Error("Couldn't get master node")
        }
        const masterWorkload = masterWorkloads[0]
        const networkName = masterWorkload.data["network"].interfaces[0].network
        const networkIpRange = Addr(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString()
        let network = new Network(networkName, networkIpRange)
        await network.load(true)
        const [twinDeployments, _] = await kubernetes.add_worker(options.name,
            options.node_id,
            masterWorkload.data["env"]["K3S_TOKEN"],
            masterWorkload.data["network"]["interfaces"][0]["ip"],
            options.cpu,
            options.memory,
            options.disk_size,
            options.public_ip,
            network,
            masterWorkload.data["env"]["SSH_KEY"],
            masterWorkload.metadata,
            masterWorkload.description)

        // twindeployments can be 2 deployments if there is access node deployment done,
        // but as there is a deployment already so the access node deployment already done
        // then we need only the machine deployment.
        // but it may have a network update
        let finalTwinDeployments = twinDeployments.filter(d => d.operation === Operations.update)
        let twinDeployment = twinDeployments.pop()
        let deploymentFactory = new DeploymentFactory();
        const contract_id = this._getContractIdFromNodeId(options.deployment_name, options.node_id)
        if (contract_id) {
            for (const deploymentObj of deploymentObjs) {
                let oldDeployment = deploymentFactory.fromObj(deploymentObj)
                if (oldDeployment.contract_id !== contract_id) {
                    continue
                }
                let newDeployment = deploymentFactory.fromObj(deploymentObj)
                newDeployment.workloads = newDeployment.workloads.concat(twinDeployment.deployment.workloads)
                const deployment = await deploymentFactory.UpdateDeployment(oldDeployment, newDeployment, network)
                twinDeployment.deployment = deployment
                twinDeployment.operation = Operations.update
                break
            }
        }
        finalTwinDeployments.push(twinDeployment)
        let twinDeploymentHandler = new TwinDeploymentHandler()
        const contracts = await twinDeploymentHandler.handle(finalTwinDeployments)
        this.save(options.deployment_name, contracts)
        return { "contracts": contracts }
    }

    @expose
    async delete_worker(options: DeleteWorker) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no k8s deployment with name: ${options.deployment_name}`)
        }
        const kubernetes = new Kubernetes()
        let twinDeploymentHandler = new TwinDeploymentHandler()
        let deployments = await this._get(options.deployment_name)
        for (const deployment of deployments) {
            const twinDeployments = await kubernetes.deleteNode(deployment, [options.name])
            const contracts = await twinDeploymentHandler.handle(twinDeployments)
            if (contracts["deleted"].length > 0 || contracts["updated"].length > 0) {
                this.save(options.deployment_name, contracts)
                return contracts
            }
        }
        throw Error(`Worker node with name ${options.name} is not found`)
    }
}


export { K8s as k8s }