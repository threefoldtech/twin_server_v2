import { Disk, VM, IPv4, DeploymentFactory, Network } from "../primitives/index"
import { expose } from "../helpers/expose"
import { generateString, randomChoice } from "../helpers/utils"
import { createContractAndSendToZos } from "./utils"
import { getAccessNodes } from "../primitives/nodes"


class Machine {
    @expose
    async deploy(options) {
        let contracts = []
        let workloads = [];
        // disks
        let disks = [];
        for (let i = 0; i < options.disks.length; i++) {
            const d = options.disks[i];
            const dName = generateString(10);
            const disk = new Disk()
            workloads.push(disk.create(d.size, dName, options.metadata, options.description))
            disks.push(disk.createMount(dName, d.mountpoint))
        }
        // ipv4
        let ipName = "";
        let publicIPs = 0;
        if (options.public_ip) {
            const ipv4 = new IPv4();
            ipName = generateString(10);
            workloads.push(ipv4.create(ipName, options.metadata, options.description))
            publicIPs++;
        }
        // network
        const networkName = options.network.name;
        let network = new Network(networkName, options.network.ip_range)
        await network.load(true)
        const accessNodes = await getAccessNodes()
        let access_net_workload
        let wgConfig = ""
        if (!Object.keys(accessNodes).includes(options.node_id.toString())) {
            // add node to any access node and deploy it
            let filteredAccessNodes = []
            for (const accessNodeId of Object.keys(accessNodes)) {
                if (accessNodes[accessNodeId]["ipv4"]) {
                    filteredAccessNodes.push(accessNodeId)
                }
            }
            const node_id = randomChoice(filteredAccessNodes)
            access_net_workload = await network.addNode(node_id, options.metadata, options.description)
            wgConfig = await network.addAccess(node_id, true)
        }
        const znet_workload = await network.addNode(options.node_id, options.metadata, options.description)
        if (znet_workload) {
            if (!access_net_workload) {
                wgConfig = await network.addAccess(options.node_id, true)
                znet_workload["data"] = network.updateNetwork(znet_workload.data)
            }
            workloads.push(znet_workload)
        }
        else {
            throw Error("Network update is not implemented")
        }

        let deploymentFactory = new DeploymentFactory();
        if (access_net_workload) {
            const accessNodeId = access_net_workload.data["node_id"]
            access_net_workload["data"] = network.updateNetwork(access_net_workload.data)
            let [deployment, deploymentHash] = deploymentFactory.create([access_net_workload], 1626394539, options.metadata, options.description)
            const net_contract = await createContractAndSendToZos(deployment, accessNodeId, deploymentHash, 0)
            await network.save(net_contract["contract_id"], [], accessNodeId)
            contracts.push(net_contract)
        }
        // vm 
        // check the planetary 
        const vm = new VM()
        const vmName = generateString(10)
        const machine_ip = network.getFreeIP(options.node_id)
        workloads.push(vm.create(vmName, options.flist, options.cpu, options.memory, disks, networkName, machine_ip, true, ipName, options.entrypoint, options.env, options.metadata, options.description))

        // deployment
        // NOTE: expiration is not used for zos deployment
        let [deployment, deploymentHash] = deploymentFactory.create(workloads, 1626394539, options.metadata, options.description)

        const machine_contract = await createContractAndSendToZos(deployment, options.node_id, deploymentHash, publicIPs)
        contracts.push(machine_contract)
        await network.save(machine_contract["contract_id"], [machine_ip], options.node_id)
        return { "contracts": contracts, "wireguard_config": wgConfig }
    }
}

export { Machine as machine }