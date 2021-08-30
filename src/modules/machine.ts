import { Disk, VM, IPv4, DeploymentFactory, Network } from "../primitives/index"
import { expose } from "../helpers/expose"
import { generateString } from "../helpers/utils"
import { createContractAndSendToZos } from "./utils"

class Machine {
    @expose
    async deploy(options) {
        // disks
        let workloads = [];
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
        const networkName = options.network_name;
        let network = new Network(networkName, options.ip_range)
        const znet_workload = network.create(options.ip_range, options.ip, options.metadata, options.description)
        if (znet_workload) {
            workloads.push(znet_workload)
        }
        // vm 
        // need to validate the ip, and check the planetary 
        const vm = new VM()
        const vmName = generateString(10)
        workloads.push(vm.create(vmName, options.flist, options.cpu, options.memory, disks, networkName, options.ip, true, ipName, options.entrypoint, options.env, options.metadata, options.description))

        // deployment
        // NOTE: expiration is not used for zos deployment
        let deploymentFactory = new DeploymentFactory();
        let [deployment, deploymentHash] = deploymentFactory.create(workloads, 1626394539, options.metadata, options.description)

        return await createContractAndSendToZos(deployment, options.node_id, options.node_twin_id, deploymentHash, publicIPs)

    }
}

export { Machine as machine }