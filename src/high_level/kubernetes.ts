import { Network } from "../primitives/network"
import { VirtualMachine } from "../high_level//machine"
import { generateString } from "../helpers/utils"

const Flist = "https://hub.grid.tf/ahmed_hanafy_1/ahmedhanafy725-k3s-latest.flist"

class Kubernetes {
    async add_master(nodeId: number,
        secret: string,
        cpu: number,
        memory: number,
        diskSize: number,
        publicIp: boolean,
        network: Network,
        sshKey: string,
        metadata: string = "",
        description: string = "") {
        const name = generateString(10)
        const machine = new VirtualMachine()
        const env = {
            "SSH_KEY": sshKey,
            "K3S_TOKEN": secret,
            "K3S_DATA_DIR": "/mnt/data",
            "K3S_FLANNEL_IFACE": "eth0",
            "K3S_NODE_NAME": name,
            "K3S_URL": ""
        }
        const disk = {
            "size": diskSize,
            "mountpoint": "/mnt/data" // it must be the same as the K3S_DATA_DIR
        }
        return await machine.create(name,
            nodeId,
            Flist,
            cpu,
            memory,
            [disk],
            publicIp,
            network,
            "/sbin/zinit init",
            env,
            metadata,
            description)
    }

    async add_worker(nodeId: number,
        secret: string,
        masterIp: string,
        cpu: number,
        memory: number,
        diskSize: number,
        publicIp: boolean,
        network: Network,
        sshKey: string,
        metadata: string = "",
        description: string = "") {

        const name = generateString(10)
        const machine = new VirtualMachine()
        const env = {
            "SSH_KEY": sshKey,
            "K3S_TOKEN": secret,
            "K3S_DATA_DIR": "/mnt/data",
            "K3S_FLANNEL_IFACE": "eth0",
            "K3S_NODE_NAME": name,
            "K3S_URL": `https://${masterIp}:6443`
        }
        const disk = {
            "size": diskSize,
            "mountpoint": "/mnt/data" // it must be the same as the K3S_DATA_DIR
        }
        return await machine.create(name,
            nodeId,
            Flist,
            cpu,
            memory,
            [disk],
            publicIp,
            network,
            "/sbin/zinit init",
            env,
            metadata,
            description)
    }
}
export { Kubernetes }