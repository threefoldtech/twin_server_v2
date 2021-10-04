import { WorkloadTypes } from "grid3_client";

import { BaseModule } from "./base";
import { Machines, MachinesDelete, MachinesGet } from "./models";
import { Network } from "grid3_client";
import { VirtualMachine } from "grid3_client";
import { expose } from "../helpers/expose";
import { default as config } from "../../config.json";


class Machine extends BaseModule {
    fileName = "machines.json";
    vm: VirtualMachine;
    constructor() {
        super();
        this.vm = new VirtualMachine(config.twin_id, config.url, config.mnemonic, this.rmbClient);
    }

    @expose
    async deploy(options: Machines) {
        if (this.exists(options.name)) {
            throw Error(`Another machine deployment with the same name ${options.name} is already exist`);
        }

        const networkName = options.network.name;
        const network = new Network(networkName, options.network.ip_range, this.rmbClient);
        await network.load(true);

        const [twinDeployments, wgConfig] = await this.vm.create(
            options.name,
            options.node_id,
            options.flist,
            options.cpu,
            options.memory,
            options.disks,
            options.public_ip,
            network,
            options.entrypoint,
            options.env,
            options.metadata,
            options.description,
        );

        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts, wgConfig);
        return { contracts: contracts, wireguard_config: wgConfig };
    }

    @expose
    list() {
        return this._list();
    }

    @expose
    async get(options: MachinesGet) {
        return await this._get(options.name);
    }

    @expose
    async delete(options: MachinesDelete) {
        return await this._delete(options.name);
    }

    @expose
    async update(options: Machines) {
        if (!this.exists(options.name)) {
            throw Error(`There is no machine with name: ${options.name}`);
        }
        if (!this._getDeploymentNodeIds(options.name).includes(options.node_id)) {
            throw Error("node_id can't be changed");
        }
        const deploymentObj = (await this._get(options.name)).pop();
        const oldDeployment = this.deploymentFactory.fromObj(deploymentObj);

        for (const workload of oldDeployment.workloads) {
            if (workload.type !== WorkloadTypes.network) {
                continue;
            }
            if (workload.name !== options.network.name) {
                throw Error("Network name can't be changed");
            }
        }

        const networkName = options.network.name;
        const network = new Network(networkName, options.network.ip_range, this.rmbClient);
        await network.load(true);

        const twinDeployment = await this.vm.update(
            oldDeployment,
            options.name,
            options.node_id,
            options.flist,
            options.cpu,
            options.memory,
            options.disks,
            options.public_ip,
            network,
            options.entrypoint,
            options.env,
            options.metadata,
            options.description,
        );

        console.log(JSON.stringify(twinDeployment));
        const contracts = await this.twinDeploymentHandler.handle([twinDeployment]);
        return { contracts: contracts };
    }
}

export { Machine as machine };
