import { QSFSZDBSModel, QSFSZDBGetModel, QSFSZDBDeleteModel, QSFSZdbsModule } from "grid3_client";

import { expose } from "../helpers/expose";
import { Base } from "./base";

class QSFSZDBS extends Base {
    qsfs_zdbs: QSFSZdbsModule;

    constructor() {
        super();
        this.qsfs_zdbs = this.client.qsfs_zdbs;
    }

    @expose
    async deploy(options: QSFSZDBSModel) {
        return await this.qsfs_zdbs.deploy(options);
    }

    @expose
    list() {
        return this.qsfs_zdbs.list();
    }

    @expose
    async get(options: QSFSZDBGetModel) {
        return await this.qsfs_zdbs.get(options);
    }

    @expose
    async delete(options: QSFSZDBDeleteModel) {
        return await this.qsfs_zdbs.delete(options);
    }
}

export { QSFSZDBS as qsfs_zdbs };
