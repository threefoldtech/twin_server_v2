import {
    Deployment,
    Workload,
    SignatureRequest,
    SignatureRequirement,
    Zdb,
    WorkloadTypes,
    ZmachineNetwork,
    Zmachine,
    Zmount,
    Znet,
    PublicIP,
    ComputeCapacity,
    Peer,
    Mount,
    TFClient
} from "grid3_client"

import { Network } from "./network"
import { default as config } from "../../config.json"


class DeploymentFactory {
    create(workloads: Workload[], expiration: number, metadata: string = "", description: string = "", version: number = 0): Deployment {
        let signature_request = new SignatureRequest();
        signature_request.twin_id = config.twin_id;
        signature_request.weight = 1;

        let signature_requirement = new SignatureRequirement();
        signature_requirement.weight_required = 1;
        signature_requirement.requests = [signature_request];

        let deployment = new Deployment();
        deployment.version = 0;
        deployment.metadata = metadata
        deployment.description = description
        deployment.twin_id = config.twin_id;
        deployment.expiration = expiration;
        deployment.workloads = workloads;
        deployment.signature_requirement = signature_requirement;

        return deployment
    }

    async UpdateDeployment(oldDeployment: Deployment, newDeployment: Deployment, network: Network = null): Promise<Deployment> {
        let oldWorkloadNames = [];
        let newWorkloadNames = [];
        let deletedWorkloads = [];
        let newWorkloads = [];
        let foundUpdate = false;
        const deploymentVersion = oldDeployment.version;
        for (const workload of oldDeployment.workloads) {
            oldWorkloadNames.push(workload.name);
        }
        for (const workload of newDeployment.workloads) {
            newWorkloadNames.push(workload.name);
        }

        for (let workload of oldDeployment.workloads) {
            if (workload.type === WorkloadTypes.network) {
                continue
            }
            if (!newWorkloadNames.includes(workload.name)) {
                deletedWorkloads.push(workload)
                foundUpdate = true
                continue;
            }
            for (let w of newDeployment.workloads) {
                if (!oldWorkloadNames.includes(w.name)) {
                    w.version = deploymentVersion + 1
                    newWorkloads.push(w)
                    oldWorkloadNames.push(w.name)
                    foundUpdate = true
                    continue;
                }
                if (w.type === WorkloadTypes.network) {
                    continue;
                }
                if (w.name !== workload.name) {
                    continue;
                }
                const oldVersion = workload.version
                workload.version = 0
                // Don't change the machine ip
                if (w.type === WorkloadTypes.zmachine) {
                    const tfclient = new TFClient(config.url, config.mnemonic)
                    await tfclient.connect()
                    const contract = await tfclient.contracts.get(oldDeployment.contract_id)
                    const node_id = contract["node_id"]
                    network.deleteReservedIp(node_id, w.data["network"]["interfaces"][0]["ip"])
                    const oldMachineIp = workload.data["network"]["interfaces"][0]["ip"]
                    w.data["network"]["interfaces"][0]["ip"] = oldMachineIp
                }
                if (w.challenge() === workload.challenge()) {
                    workload.version = oldVersion
                    continue;
                }
                workload.version = deploymentVersion + 1
                workload.data = w.data
                workload.description = w.description
                workload.metadata = w.metadata
                foundUpdate = true
                break
            }
        }
        // add new workloads 
        oldDeployment.workloads = oldDeployment.workloads.concat(newWorkloads)

        // remove the deleted workloads
        oldDeployment.workloads = oldDeployment.workloads.filter(item => !deletedWorkloads.includes(item))

        if (!foundUpdate) {
            return null;
        }
        return oldDeployment;
    }

    fromObj(deployment: Object) {
        let d = new Deployment()
        Object.assign(d, deployment)
        let signature_requirement = new SignatureRequirement()
        Object.assign(signature_requirement, d.signature_requirement)
        let requests = [];
        for (let request of signature_requirement.requests) {
            let r = new SignatureRequest()
            Object.assign(r, request)
            requests.push(r)
        }
        signature_requirement.requests = requests
        d.signature_requirement = signature_requirement
        let workloads = []
        for (let workload of d.workloads) {
            let w = new Workload()
            Object.assign(w, workload)
            if (workload.type === WorkloadTypes.ipv4) {
                let ipv4 = new PublicIP()
                Object.assign(ipv4, w.data)
                w.data = ipv4
                workloads.push(w)
            }
            else if (workload.type === WorkloadTypes.zdb) {
                let zdb = new Zdb()
                Object.assign(zdb, w.data)
                w.data = zdb
                workloads.push(w)
            }
            else if (workload.type === WorkloadTypes.network) {
                let znet = new Znet()
                Object.assign(znet, w.data)
                let peers = []
                for (let peer of znet.peers) {
                    let p = new Peer()
                    Object.assign(p, peer)
                    peers.push(p)
                }
                znet.peers = peers
                w.data = znet
                workloads.push(w)
            }
            else if (workload.type === WorkloadTypes.zmount) {
                let zmount = new Zmount()
                Object.assign(zmount, w.data)
                w.data = zmount
                workloads.push(w)
            }
            else if (workload.type === WorkloadTypes.zmachine) {
                let zmachine = new Zmachine()
                Object.assign(zmachine, w.data)
                let net = new ZmachineNetwork()
                Object.assign(net, zmachine.network)
                zmachine.network = net
                let computeCapacity = new ComputeCapacity()
                Object.assign(computeCapacity, zmachine.compute_capacity)
                zmachine.compute_capacity = computeCapacity
                let mounts = []
                for (let mount of zmachine.mounts) {
                    let m = new Mount()
                    Object.assign(m, mount)
                    mounts.push(m)
                }
                zmachine.mounts = mounts
                w.data = zmachine
                workloads.push(w)
            }
        }
        d.workloads = workloads
        return d
    }
}
export { DeploymentFactory }