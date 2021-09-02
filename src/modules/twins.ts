import { TFClient } from "grid3_client"

import { TwinCreate, TwinGet, TwinList, TwinDelete } from "./models"
import { expose } from "../helpers/index"
import { default as config } from "../../config.json"

class Twins {
    client: TFClient
    constructor() {
        this.client = new TFClient(config.url, config.mnemonic)
    }
    @expose
    async create(options: TwinCreate) {
        await this.client.connect()
        return await this.client.twins.create(options.ip)
    }
    @expose
    async get(options: TwinGet) {
        await this.client.connect()
        return await this.client.twins.get(options.id)
    }
    @expose
    async list(options: TwinList) {
        await this.client.connect()
        return await this.client.twins.list()
    }
    @expose
    async delete(options: TwinDelete) {
        await this.client.connect()
        return await this.client.twins.delete(options.id)
    }
}

export { Twins as twins }