import { TFGridClient } from "../clients/tfgrid";

import { NodeContractCreate, NameContractCreate, ContractGet, NodeContractUpdate, ContractCancel } from "./models";
import { expose } from "../helpers/expose";

class Contracts {
    client: TFGridClient;
    context;
    constructor() {
        this.client = new TFGridClient();
        this.context = this.client.contracts;
    }

    @expose
    async create_node(options: NodeContractCreate) {
        return await this.client.execute(this.context, this.client.contracts.createNode, [options.node_id, options.hash, options.data, options.public_ip]);
    }
    @expose
    async create_name(options: NameContractCreate) {
        return await this.client.execute(this.context, this.client.contracts.createName, [options.name]);
    }
    @expose
    async get(options: ContractGet) {
        return await this.client.execute(this.context, this.client.contracts.get, [options.id]);
    }
    @expose
    async update_node(options: NodeContractUpdate) {
        return await this.client.execute(this.context, this.client.contracts.updateNode, [options.id, options.data, options.hash]);
    }
    @expose
    async cancel(options: ContractCancel) {
        return await this.client.execute(this.context, this.client.contracts.cancel, [options.id]);
    }
}

export { Contracts as contracts };
