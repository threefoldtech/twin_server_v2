import { Workload, WorkloadTypes } from "grid3_client";
import { Addr } from "netaddr";

import { AddWorker, DeleteWorker, K8S, K8SDelete, K8SGet } from "./models";
import { BaseModule } from "./base";
import { expose } from "../helpers/index";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { TwinDeployment, Operations } from "../high_level/models";
import { Kubernetes } from "../high_level/kubernetes";
import { Network } from "../primitives/network";

class K8s extends BaseModule {
    fileName = "kubernetes.json";

    _getMastersWorkload(deployments): Workload[] {
        const workloads = [];
        for (const deployment of deployments) {
            let d = deployment;
            if (deployment instanceof TwinDeployment) {
                d = deployment.deployment;
            }
            for (const workload of d.workloads) {
                if (workload.type === WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] === "") {
                    workloads.push(workload);
                }
            }
        }
        return workloads;
    }

    _getMastersIp(deployments): string[] {
        const ips = [];
        const workloads = this._getMastersWorkload(deployments);
        for (const workload of workloads) {
            ips.push(workload.data["network"]["interfaces"][0]["ip"]);
        }
        return ips;
    }

    async _createDeployment(options: K8S, network: Network, masterIps: string[] = []): Promise<[TwinDeployment[], string]> {
        let deployments = [];
        let wireguardConfig = "";
        const kubernetes = new Kubernetes();

        for (const master of options.masters) {
            const [twinDeployments, wgConfig] = await kubernetes.add_master(
                master.name,
                master.node_id,
                options.secret,
                master.cpu,
                master.memory,
                master.disk_size,
                master.public_ip,
                network,
                options.ssh_key,
                options.metadata,
                options.description,
            );

            deployments = deployments.concat(twinDeployments);
            if (wgConfig) {
                wireguardConfig = wgConfig;
            }
        }

        if (masterIps.length === 0) {
            masterIps = this._getMastersIp(deployments);
            if (masterIps.length === 0) {
                throw Error("Couldn't get master ip");
            }
        }
        for (const worker of options.workers) {
            const [twinDeployments, _] = await kubernetes.add_worker(
                worker.name,
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
                options.description,
            );

            deployments = deployments.concat(twinDeployments);
        }
        return [deployments, wireguardConfig];
    }

    @expose
    async deploy(options: K8S) {
        if (options.masters.length > 1) {
            throw Error("Multi master is not supported");
        }

        if (this.exists(options.name)) {
            throw Error(`Another k8s deployment with the same name ${options.name} is already exist`);
        }

        const network = new Network(options.network.name, options.network.ip_range);
        await network.load(true);

        const [deployments, wireguardConfig] = await this._createDeployment(options, network);
        const twinDeploymentHandler = new TwinDeploymentHandler();
        const contracts = await twinDeploymentHandler.handle(deployments);
        this.save(options.name, contracts, wireguardConfig);
        return { contracts: contracts, wireguard_config: wireguardConfig };
    }

    @expose
    list() {
        return this._list();
    }

    @expose
    async get(options: K8SGet) {
        return await this._get(options.name);
    }

    @expose
    async delete(options: K8SDelete) {
        return await this._delete(options.name);
    }

    @expose
    async update(options: K8S) {
        if (!this.exists(options.name)) {
            throw Error(`There is no k8s deployment with name: ${options.name}`);
        }
        if (options.masters.length > 1) {
            throw Error("Multi master is not supported");
        }
        const oldDeployments = await this._get(options.name);
        for (const workload of oldDeployments[0].workloads) {
            if (workload.type !== WorkloadTypes.network) {
                continue;
            }
            if (workload.name !== options.network.name) {
                throw Error("Network name can't be changed");
            }
        }

        const masterIps = this._getMastersIp(oldDeployments);
        if (masterIps.length === 0) {
            throw Error("Couldn't get master ip");
        }

        const networkName = options.network.name;
        const network = new Network(networkName, options.network.ip_range);
        await network.load(true);

        //TODO: check that the master nodes are not changed
        const kubernetes = new Kubernetes();

        let [twinDeployments, _] = await this._createDeployment(options, network, masterIps);
        return await this._update(kubernetes, options.name, oldDeployments, twinDeployments, network);
    }

    @expose
    async add_worker(options: AddWorker) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no k8s deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const kubernetes = new Kubernetes();
        const masterWorkloads = this._getMastersWorkload(oldDeployments);
        if (masterWorkloads.length === 0) {
            throw Error("Couldn't get master node");
        }
        const masterWorkload = masterWorkloads[0];
        const networkName = masterWorkload.data["network"].interfaces[0].network;
        const networkIpRange = Addr(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString();
        const network = new Network(networkName, networkIpRange);
        await network.load(true);
        const [twinDeployments, _] = await kubernetes.add_worker(
            options.name,
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
            masterWorkload.description,
        );

        return await this._add(options.deployment_name, options.node_id, oldDeployments, twinDeployments, network);
    }

    @expose
    async delete_worker(options: DeleteWorker) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no k8s deployment with name: ${options.deployment_name}`);
        }
        const kubernetes = new Kubernetes();
        return await this._deleteInstance(kubernetes, options.deployment_name, options.name);
    }
}

export { K8s as k8s };
