import { Network } from "../primitives/index"
import { expose } from "../helpers/expose"
import { VirtualMachine } from "../high_level/machine"
import { DeploymentFactory } from "../high_level/deploymentFactory"
import { Machines } from "./models"


class Machine {
    @expose
    async deploy(options: Machines) {

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

        let deploymentFactory = new DeploymentFactory()
        const contracts = await deploymentFactory.deploy(twinDeployments, network)

        return { "contracts": contracts, "wireguard_config": wgConfig }
    }
}

export { Machine as machine }