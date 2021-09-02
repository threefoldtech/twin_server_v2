import { TFClient } from "grid3_client"

import { ContractCreate, ContractGet, ContractUpdate, ContractCancel } from "./models"
import { expose } from "../helpers/index"
import { default as config } from "../../config.json"


class Contracts {
    client: TFClient
    constructor() {
        this.client = new TFClient(config.url, config.mnemonic)
    }
    @expose
    async create(options: ContractCreate) {
        await this.client.connect()
        return await this.client.contracts.create(options.node_id, options.hash, options.data, options.public_ip)
    }
    @expose
    async get(options: ContractGet) {
        await this.client.connect()
        return await this.client.contracts.get(options.id)
    }
    @expose
    async update(options: ContractUpdate) {
        await this.client.connect()
        return await this.client.contracts.update(options.id, options.data, options.hash)
    }
    @expose
    async cancel(options: ContractCancel) {
        await this.client.connect()
        return await this.client.contracts.cancel(options.id)
    }
}

export { Contracts as contracts }