import { TFGridClient } from "../clients/tfgrid";

import { TwinCreate, TwinGet, TwinDelete } from "./models";
import { expose } from "../helpers/expose";

class Twins {
    client: TFGridClient;
    context;
    constructor() {
        this.client = new TFGridClient();
        this.context = this.client.twins;
    }
    @expose
    async create(options: TwinCreate) {
        return await this.client.execute(this.context, this.client.twins.create, [options.ip]);
    }
    @expose
    async get(options: TwinGet) {
        return await this.client.execute(this.context, this.client.twins.get, [options.id]);
    }
    @expose
    async list() {
        return await this.client.execute(this.context, this.client.twins.list, []);
    }
    @expose
    async delete(options: TwinDelete) {
        return await this.client.execute(this.context, this.client.twins.delete, [options.id]);
    }
}

export { Twins as twins };
