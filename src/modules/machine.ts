import { WorkloadTypes } from "grid3_client"

import { BaseModule } from "./base"
import { Machines } from "./models"
import { Network } from "../primitives/network"
import { DeploymentFactory } from "../primitives/deployment"
import { expose } from "../helpers/expose"
import { VirtualMachine } from "../high_level/machine"
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler"


class Machine extends BaseModule {
    fileName: string = "machines.json";

    @expose
    async deploy(options: Machines) {

        if (this.exists(options.name)) {
            throw Error(`Another machine deployment with the same name ${options.name} is already exist`)
        }

        const networkName = options.network.name;
        let network = new Network(networkName, options.network.ip_range)
        await network.load(true)

        const vm = new VirtualMachine()
        let [twinDeployments, wgConfig] = await vm.create(
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
            options.description)

        let twinDeploymentHandler = new TwinDeploymentHandler()
        const contracts = await twinDeploymentHandler.handle(twinDeployments)
        this.save(options.name, contracts, wgConfig)
        return { "contracts": contracts, "wireguard_config": wgConfig }
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
    async update(options: Machines) {
        if (!this.exists(options.name)) {
            throw Error(`There is no machine with name: ${options.name}`)
        }
        if (!this._getDeploymentNodeIds(options.name).includes(options.node_id)) {
            throw Error("node_id can't be changed")
        }
        let deploymentObj = (await this._get(options.name)).pop()
        let deploymentFactory = new DeploymentFactory()
        let oldDeployment = deploymentFactory.fromObj(deploymentObj)

        for (const workload of oldDeployment.workloads) {
            if (workload.type !== WorkloadTypes.network) {
                continue
            }
            if (workload.name !== options.network.name) {
                throw Error("Network name can't be changed")
            }
        }

        const networkName = options.network.name;
        let network = new Network(networkName, options.network.ip_range)
        await network.load(true)

        const vm = new VirtualMachine()
        let twinDeployment = await vm.update(oldDeployment,
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
            options.description)

        let twinDeploymentHandler = new TwinDeploymentHandler()
        console.log(JSON.stringify(twinDeployment))
        const contracts = await twinDeploymentHandler.handle([twinDeployment])
        return { "contracts": contracts }
    }
}

export { Machine as machine }