import * as PATH from "path";

import { MessageBusClient, Deployment } from "grid3_client";

import { HighLevelBase } from "../high_level/base";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { TwinDeployment, Operations } from "../high_level/models";
import { Kubernetes } from "../high_level/kubernetes";
import { Zdb } from "../high_level/zdb";
import { loadFromFile, updatejson, appPath } from "../helpers/jsonfs";
import { getNodeTwinId } from "../primitives/nodes";
import { DeploymentFactory } from "../primitives/deployment";
import { Network } from "../primitives/network";

class BaseModule {
    fileName = "";

    save(name: string, contracts: Record<string, unknown[]>, wgConfig = "", action = "add") {
        const path = PATH.join(appPath, this.fileName);
        const data = loadFromFile(path);
        let deploymentData = { contracts: [], wireguard_config: "" };
        if (Object.keys(data).includes(name)) {
            deploymentData = data[name];
        }

        for (const contract of contracts["created"]) {
            deploymentData.contracts.push({ contract_id: contract["contract_id"], node_id: contract["node_id"] });
        }
        for (const contract of contracts["deleted"]) {
            deploymentData.contracts = deploymentData.contracts.filter(
                c => c["contract_id"] !== contract["contract_id"],
            );
        }
        if (action === "delete") {
            for (const contract of contracts["updated"]) {
                deploymentData.contracts = deploymentData.contracts.filter(
                    c => c["contract_id"] !== contract["contract_id"],
                );
            }
        }
        if (wgConfig) {
            deploymentData["wireguard_config"] = wgConfig;
        }
        updatejson(path, name, deploymentData);
        return deploymentData;
    }

    _list(): string[] {
        const path = PATH.join(appPath, this.fileName);
        const data = loadFromFile(path);
        return Object.keys(data);
    }

    exists(name: string): boolean {
        return this._list().includes(name);
    }

    _getDeploymentNodeIds(name: string): number[] {
        const nodeIds = [];
        const contracts = this._getContracts(name);
        for (const contract of contracts) {
            nodeIds.push(contract["node_id"]);
        }
        return nodeIds;
    }

    _getContracts(name: string): string[] {
        const path = PATH.join(appPath, this.fileName);
        const data = loadFromFile(path);
        if (!Object.keys(data).includes(name)) {
            return [];
        }
        return data[name]["contracts"];
    }

    _getContractIdFromNodeId(name: string, nodeId: number): number {
        const contracts = this._getContracts(name);
        for (const contract of contracts) {
            if (contract["node_id"] === nodeId) {
                return contract["contract_id"];
            }
        }
    }
    _getNodeIdFromContractId(name: string, contractId: number): number {
        const contracts = this._getContracts(name);
        for (const contract of contracts) {
            if (contract["contract_id"] === contractId) {
                return contract["node_id"];
            }
        }
    }

    async _get(name: string) {
        const path = PATH.join(appPath, this.fileName);
        const data = loadFromFile(path);
        if (!Object.keys(data).includes(name)) {
            return [];
        }
        const deployments = [];
        const rmb = new MessageBusClient();
        for (const contract of data[name]["contracts"]) {
            const node_twin_id = await getNodeTwinId(contract["node_id"]);
            const payload = JSON.stringify({ contract_id: contract["contract_id"] });

            const msg = rmb.prepare("zos.deployment.get", [node_twin_id], 0, 2);
            rmb.send(msg, payload);
            const result = await rmb.read(msg);
            if (result[0].err) {
                throw Error(result[0].err);
            }
            deployments.push(JSON.parse(result[0].dat));
        }
        return deployments;
    }

    async _update(
        module: Kubernetes | Zdb,
        name: string,
        oldDeployments: Deployment[],
        twinDeployments: TwinDeployment[],
        network: Network = null,
    ) {
        const deploymentFactory = new DeploymentFactory();
        const twinDeploymentHandler = new TwinDeploymentHandler();
        let finalTwinDeployments = [];
        finalTwinDeployments = twinDeployments.filter(d => d.operation === Operations.update);
        twinDeployments = twinDeploymentHandler.deployMerge(twinDeployments);
        const deploymentNodeIds = this._getDeploymentNodeIds(name);
        finalTwinDeployments = finalTwinDeployments.concat(
            twinDeployments.filter(d => !deploymentNodeIds.includes(d.nodeId)),
        );

        for (let oldDeployment of oldDeployments) {
            oldDeployment = deploymentFactory.fromObj(oldDeployment);
            const node_id = this._getNodeIdFromContractId(name, oldDeployment.contract_id);
            let deploymentFound = false;
            for (const twinDeployment of twinDeployments) {
                if (twinDeployment.nodeId !== node_id) {
                    continue;
                }
                oldDeployment = await deploymentFactory.UpdateDeployment(
                    oldDeployment,
                    twinDeployment.deployment,
                    network,
                );
                deploymentFound = true;
                if (!oldDeployment) {
                    continue;
                }
                finalTwinDeployments.push(new TwinDeployment(oldDeployment, Operations.update, 0, 0, network));
                break;
            }
            if (!deploymentFound) {
                const tDeployments = await module.delete(oldDeployment, []);
                finalTwinDeployments = finalTwinDeployments.concat(tDeployments);
            }
        }
        const contracts = await twinDeploymentHandler.handle(finalTwinDeployments);
        if (contracts.created.length === 0 && contracts.updated.length === 0 && contracts.deleted.length === 0) {
            return "Nothing found to update";
        }
        this.save(name, contracts);
        return { contracts: contracts };
    }

    async _add(
        deployment_name: string,
        node_id: number,
        oldDeployments: Deployment[],
        twinDeployments: TwinDeployment[],
        network: Network = null,
    ) {
        const finalTwinDeployments = twinDeployments.filter(d => d.operation === Operations.update);
        const twinDeployment = twinDeployments.pop();
        const deploymentFactory = new DeploymentFactory();
        const contract_id = this._getContractIdFromNodeId(deployment_name, node_id);
        if (contract_id) {
            for (let oldDeployment of oldDeployments) {
                oldDeployment = deploymentFactory.fromObj(oldDeployment);
                if (oldDeployment.contract_id !== contract_id) {
                    continue;
                }
                const newDeployment = deploymentFactory.fromObj(oldDeployment);
                newDeployment.workloads = newDeployment.workloads.concat(twinDeployment.deployment.workloads);
                const deployment = await deploymentFactory.UpdateDeployment(oldDeployment, newDeployment, network);
                twinDeployment.deployment = deployment;
                twinDeployment.operation = Operations.update;
                break;
            }
        }
        finalTwinDeployments.push(twinDeployment);
        const twinDeploymentHandler = new TwinDeploymentHandler();
        const contracts = await twinDeploymentHandler.handle(finalTwinDeployments);
        this.save(deployment_name, contracts);
        return { contracts: contracts };
    }

    async _deleteInstance(module: Kubernetes | Zdb, deployment_name: string, name: string) {
        const twinDeploymentHandler = new TwinDeploymentHandler();
        const deployments = await this._get(deployment_name);
        for (const deployment of deployments) {
            const twinDeployments = await module.delete(deployment, [name]);
            const contracts = await twinDeploymentHandler.handle(twinDeployments);
            if (contracts["deleted"].length > 0 || contracts["updated"].length > 0) {
                this.save(deployment_name, contracts, "", "delete");
                return contracts;
            }
        }
        throw Error(`instance with name ${name} is not found`);
    }

    async _delete(name: string) {
        const path = PATH.join(appPath, this.fileName);
        const data = loadFromFile(path);
        const contracts = { deleted: [], updated: [] };
        if (!Object.keys(data).includes(name)) {
            return contracts;
        }
        const twinDeploymentHandler = new TwinDeploymentHandler();
        const deployments = await this._get(name);
        const highlvl = new HighLevelBase();
        for (const deployment of deployments) {
            const twinDeployments = await highlvl._delete(deployment, []);
            const contract = await twinDeploymentHandler.handle(twinDeployments);
            contracts.deleted = contracts.deleted.concat(contract["deleted"]);
            contracts.updated = contracts.updated.concat(contract["updated"]);
        }
        const deletedContracts = [];
        for (const c of contracts.deleted) {
            deletedContracts.push(c["contract_id"]);
        }
        const updatedContracts = [];
        for (const c of contracts.updated) {
            if (!deletedContracts.includes(c["contract_id"])) {
                updatedContracts.push(c);
            }
        }
        contracts.updated = updatedContracts;
        updatejson(path, name, "", "delete");
        return contracts;
    }
}
export { BaseModule };
