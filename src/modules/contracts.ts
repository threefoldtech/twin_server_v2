import { TFClient } from "grid3_client";

import { NodeContractCreate, NameContractCreate, ContractGet, NodeContractUpdate, ContractCancel } from "./models";
import { expose } from "../helpers/index";
import { default as config } from "../../config.json";


class Contracts {
    client: TFClient;
    constructor() {
        this.client = new TFClient(config.url, config.mnemonic);
    }
    @expose
    async create_node(options: NodeContractCreate) {
        await this.client.connect();
        console.log(`Creating contract with node_id:${options.node_id}, hash: ${options.hash}, data: ${options.data}, number of public ips: ${options.public_ip}`);
        return await this.client.contracts.createNode(options.node_id, options.hash, options.data, options.public_ip);
    }
    @expose
    async create_name(options: NameContractCreate) {
        await this.client.connect();
        return await this.client.contracts.createName(options.name);
    }
    @expose
    async get(options: ContractGet) {
        await this.client.connect();
        console.log(`Getting contract with id: ${options.id}`);
        return await this.client.contracts.get(options.id);
    }
    @expose
    async update_node(options: NodeContractUpdate) {
        await this.client.connect();
        console.log(`Updating contract with id: ${options.id}, hash: ${options.hash}, data: ${options.data}`);
        return await this.client.contracts.updateNode(options.id, options.data, options.hash);
    }
    @expose
    async cancel(options: ContractCancel) {
        await this.client.connect();
        console.log(`Cancel contract with id: ${options.id}`);
        return await this.client.contracts.cancel(options.id);
    }
}

export { Contracts as contracts };
