import { TwinDeployment, Operations } from "./models"
import { Disk, VM, IPv4, DeploymentFactory, Network, getAccessNodes } from "../primitives/index"
import { generateString, randomChoice } from "../helpers/utils"

class VirtualMachine {

    async create(name: string,
        nodeId: number,
        flist: string,
        cpu: number,
        memory: number,
        disks: Object[],
        publicIp: boolean,
        network: Network,
        entrypoint: string,
        env: Object,
        metadata: string = "",
        description: string = ""): Promise<[TwinDeployment[], string]> {

        let deployments = []
        let workloads = [];
        // disks
        let diskMounts = [];
        for (const d of disks) {
            const dName = generateString(10);
            const disk = new Disk()
            workloads.push(disk.create(d["size"], dName, metadata, description))
            diskMounts.push(disk.createMount(dName, d["mountpoint"]))
        }
        // ipv4
        let ipName = "";
        let publicIps = 0;
        if (publicIp) {
            const ipv4 = new IPv4();
            ipName = generateString(10);
            workloads.push(ipv4.create(ipName, metadata, description))
            publicIps++;
        }

        // network
        const accessNodes = await getAccessNodes()
        let access_net_workload
        let wgConfig = ""

        let hasAccessNode = false;
        for (let accessNode of Object.keys(accessNodes)) {
            if (network.nodeExists(Number(accessNode))) {
                hasAccessNode = true;
                break;
            }
        }

        if (!Object.keys(accessNodes).includes(nodeId.toString()) && !hasAccessNode) {
            // add node to any access node and deploy it
            let filteredAccessNodes = []
            for (const accessNodeId of Object.keys(accessNodes)) {
                if (accessNodes[accessNodeId]["ipv4"]) {
                    filteredAccessNodes.push(accessNodeId)
                }
            }
            const access_node_id = randomChoice(filteredAccessNodes)
            access_net_workload = await network.addNode(access_node_id, metadata, description)
            wgConfig = await network.addAccess(access_node_id, true)
        }
        const znet_workload = await network.addNode(nodeId, metadata, description)
        if (znet_workload && network.exists()) {
            throw Error("Network update is not implemented")
        }
        else if (znet_workload) {
            if (!access_net_workload && !hasAccessNode) {
                wgConfig = await network.addAccess(nodeId, true)
                znet_workload["data"] = network.updateNetwork(znet_workload.data)
            }
            workloads.push(znet_workload)
        }

        let deploymentFactory = new DeploymentFactory();
        if (access_net_workload) {
            const accessNodeId = access_net_workload.data["node_id"]
            access_net_workload["data"] = network.updateNetwork(access_net_workload.data)
            let deployment = deploymentFactory.create([access_net_workload], 1626394539, metadata, description)
            deployments.push(new TwinDeployment(deployment, Operations.deploy, 0, accessNodeId))
        }
        // vm 
        // check the planetary 
        const vm = new VM()
        const machine_ip = network.getFreeIP(nodeId)
        workloads.push(vm.create(name, flist, cpu, memory, diskMounts, network.name, machine_ip, true, ipName, entrypoint, env, metadata, description))

        // deployment
        // NOTE: expiration is not used for zos deployment
        let deployment = deploymentFactory.create(workloads, 1626394539, metadata, description)

        deployments.push(new TwinDeployment(deployment, Operations.deploy, publicIps, nodeId))
        return [deployments, wgConfig]
    }
}

export { VirtualMachine }