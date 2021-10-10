import { ZDBS, DeleteZDB, AddZDB, ZDBGet, ZDBDelete } from "grid3_client";
import { Zdbs } from "grid3_client";
import { expose } from "../helpers/expose";
import { default as config } from "../../config.json";
import { getRMBClient } from "../clients/rmb";

class ZdbsModule {
    zdbs: Zdbs;
    constructor() {
        const rmbClient = getRMBClient();
        this.zdbs = new Zdbs(config.twin_id, config.url, config.mnemonic, rmbClient);
    }

    @expose
    async deploy(options: ZDBS) {
        return await this.zdbs.deploy(options);
    }

    @expose
    list() {
        return this.zdbs.list();
    }

    @expose
    async get(options: ZDBGet) {
        return await this.zdbs.get(options);
    }

    @expose
    async delete(options: ZDBDelete) {
        return await this.zdbs.delete(options);
    }

    @expose
    async update(options: ZDBS) {
        return await this.zdbs.update(options);
    }

    @expose
    async add_zdb(options: AddZDB) {
        return await this.zdbs.add_zdb(options);
    }

    @expose
    async delete_zdb(options: DeleteZDB) {
        return await this.zdbs.delete_zdb(options);
    }
};

export { ZdbsModule as zdbs };
