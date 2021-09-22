import { BaseModule } from "./base";
import { ZDBS, DeleteZDB, AddZDB, ZDBGet, ZDBDelete } from "./models";
import { Zdb } from "../high_level/zdb";
import { expose } from "../helpers/expose";
import { DeploymentFactory } from "../primitives/deployment";
import { TwinDeployment, Operations } from "../high_level/models";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";

class Zdbs extends BaseModule {
    fileName = "zdbs.json";

    _createDeployment(options: ZDBS): TwinDeployment[] {
        const zdbFactory = new Zdb();
        const twinDeployments = [];
        for (const instance of options.zdbs) {
            const twinDeployment = zdbFactory.create(
                instance.name,
                instance.node_id,
                instance.namespace,
                instance.disk_size,
                instance.disk_type,
                instance.mode,
                instance.password,
                instance.public,
                options.metadata,
                options.description,
            );
            twinDeployments.push(twinDeployment);
        }
        return twinDeployments;
    }

    @expose
    async deploy(options: ZDBS) {
        if (this.exists(options.name)) {
            throw Error(`Another zdb deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = this._createDeployment(options);
        const twinDeploymentHandler = new TwinDeploymentHandler();
        const contracts = await twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }

    @expose
    list() {
        return this._list();
    }

    @expose
    async get(options: ZDBGet) {
        return await this._get(options.name);
    }

    @expose
    async delete(options: ZDBDelete) {
        return await this._delete(options.name);
    }

    @expose
    async update(options: ZDBS) {
        if (!this.exists(options.name)) {
            throw Error(`There is no zdb deployment with name: ${options.name}`);
        }
        const oldDeployments = await this._get(options.name);
        let twinDeployments = this._createDeployment(options);
        const zdb = new Zdb();
        return await this._update(zdb, options.name, oldDeployments, twinDeployments);
    }

    @expose
    async add_zdb(options: AddZDB) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        const oldDeployments = await this._get(options.deployment_name);
        const zdbFactory = new Zdb();
        const twinDeployment = zdbFactory.create(
            options.name,
            options.node_id,
            options.namespace,
            options.disk_size,
            options.disk_type,
            options.mode,
            options.password,
            options.public,
            oldDeployments[0].metadata,
            oldDeployments[0].metadata,
        );

        return await this._add(options.deployment_name, options.node_id, oldDeployments, [twinDeployment]);
    }

    @expose
    async delete_zdb(options: DeleteZDB) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`);
        }
        const zdb = new Zdb();
        return await this._deleteInstance(zdb, options.deployment_name, options.name);
    }
}

export { Zdbs as zdbs };
