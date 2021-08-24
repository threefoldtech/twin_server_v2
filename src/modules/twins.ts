import { TFClient } from "grid3_client"
import { default as config } from "../../config.json"
import { expose } from "../helpers/expose"

class Twins {
    client: TFClient
    constructor() {
        this.client = new TFClient(config.url, config.mnemonic)
    }
    @expose
    async create(options) {
        await this.client.connect()
        return await this.client.twins.create(options.ip)
    }
    @expose
    async get(options) {
        await this.client.connect()
        return await this.client.twins.get(options.id)
    }
    @expose
    async list(options) {
        await this.client.connect()
        return await this.client.twins.list()
    }
    @expose
    async delete(options) {
        await this.client.connect()
        return await this.client.twins.delete(options.id)
    }
}

export { Twins as twins }