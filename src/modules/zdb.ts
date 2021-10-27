import { ZdbsModule, ZDBSModel, DeleteZDBModel, AddZDBModel, ZDBGetModel, ZDBDeleteModel } from "grid3_client";

import { expose } from "../helpers/expose";
import { Base } from "./base";

class Zdbs extends Base {
    zdbs: ZdbsModule;

    constructor() {
        super();
        this.zdbs = this.client.zdbs;
    }

    @expose
    async deploy(options: ZDBSModel) {
        return await this.zdbs.deploy(options);
    }

    @expose
    list() {
        return this.zdbs.list();
    }

    @expose
    async get(options: ZDBGetModel) {
        return await this.zdbs.get(options);
    }

    @expose
    async delete(options: ZDBDeleteModel) {
        return await this.zdbs.delete(options);
    }

    @expose
    async update(options: ZDBSModel) {
        return await this.zdbs.update(options);
    }

    @expose
    async add_zdb(options: AddZDBModel) {
        return await this.zdbs.addZdb(options);
    }

    @expose
    async delete_zdb(options: DeleteZDBModel) {
        return await this.zdbs.deleteZdb(options);
    }
}

export { Zdbs as zdbs };
