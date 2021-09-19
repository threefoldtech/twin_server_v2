import { Addr } from "netaddr"
import { Deployment, WorkloadTypes } from "grid3_client"

import { TwinDeployment, Operations } from "./models"
import { HighLevelBase } from "./base"
import { Disk, VM, IPv4, DeploymentFactory, Network, getAccessNodes } from "../primitives/index"
import { randomChoice } from "../helpers/utils"

class VirtualMachine extends HighLevelBase {

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
            const disk = new Disk()
            workloads.push(disk.create(d["size"], d["name"], metadata, description))
            diskMounts.push(disk.createMount(d["name"], d["mountpoint"]))
        }
        // ipv4
        let ipName = "";
        let publicIps = 0;
        if (publicIp) {
            const ipv4 = new IPv4();
            ipName = `${name}_pubip`
            workloads.push(ipv4.create(ipName, metadata, description))
            publicIps++;
        }

        // network
        let deploymentFactory = new DeploymentFactory();
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
            const access_node_id = Number(randomChoice(filteredAccessNodes))
            access_net_workload = await network.addNode(access_node_id, metadata, description)
            wgConfig = await network.addAccess(access_node_id, true)
        }
        const znet_workload = await network.addNode(nodeId, metadata, description)
        if (znet_workload && network.exists()) {
            // update network
            for (let deployment of network.deployments) {
                let d = deploymentFactory.fromObj(deployment)
                for (let workload of d["workloads"]) {
                    if (workload["type"] !== WorkloadTypes.network || !Addr(network.ipRange).contains(Addr(workload["data"]["subnet"]))) {
                        continue
                    }
                    workload.data = network.updateNetwork(workload["data"])
                    workload.version += 1
                    break;
                }
                deployments.push(new TwinDeployment(d, Operations.update, 0, 0, network))
            }
            workloads.push(znet_workload)
        }
        else if (znet_workload) {
            // node not exist on the network
            if (!access_net_workload && !hasAccessNode) {
                // this node is access node, so add access point on it
                wgConfig = await network.addAccess(nodeId, true)
                znet_workload["data"] = network.updateNetwork(znet_workload.data)
            }
            workloads.push(znet_workload)
        }
        if (access_net_workload) {
            // network is not exist, and the node provide is not an access node
            const accessNodeId = access_net_workload.data["node_id"]
            access_net_workload["data"] = network.updateNetwork(access_net_workload.data)
            let deployment = deploymentFactory.create([access_net_workload], 1626394539, metadata, description)
            deployments.push(new TwinDeployment(deployment, Operations.deploy, 0, accessNodeId, network))
        }
        // vm 
        // check the planetary 
        const vm = new VM()
        const machine_ip = network.getFreeIP(nodeId)
        workloads.push(vm.create(name, flist, cpu, memory, diskMounts, network.name, machine_ip, true, ipName, entrypoint, env, metadata, description))

        // deployment
        // NOTE: expiration is not used for zos deployment
        let deployment = deploymentFactory.create(workloads, 1626394539, metadata, description)

        deployments.push(new TwinDeployment(deployment, Operations.deploy, publicIps, nodeId, network))
        return [deployments, wgConfig]
    }

    async update(oldDeployment: Deployment,
        name: string,
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
        description: string = ""): Promise<TwinDeployment> {
        const vm = new VirtualMachine()
        let [twinDeployments, _] = await vm.create(name,
            nodeId,
            flist,
            cpu,
            memory,
            disks,
            publicIp,
            network,
            entrypoint,
            env,
            metadata,
            description)

        let deploymentFactory = new DeploymentFactory()
        let updatedDeployment = await deploymentFactory.UpdateDeployment(oldDeployment, twinDeployments.pop().deployment, network)
        if (!updatedDeployment) {
            throw Error("Nothing found to be updated")
        }
        return new TwinDeployment(updatedDeployment, Operations.update, 0, 0)

    }

    async delete(deployment: Deployment, names: string[]) {
        return await this._delete(deployment, names, [WorkloadTypes.ipv4, WorkloadTypes.zmount, WorkloadTypes.zmachine])
    }
}

export { VirtualMachine }