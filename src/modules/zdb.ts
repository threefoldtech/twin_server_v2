import { BaseModule } from "./base"
import { ZDB } from "./models"
import { expose } from "../helpers/expose"
import { zdb } from "../primitives/zdb"
import { DeploymentFactory } from "../primitives/deployment"
import { TwinDeployment, Operations } from "../high_level/models"
import { DeploymentFactory as TwinDeploymentFactory } from "../high_level/deploymentFactory"

class Zdb extends BaseModule {
    fileName: string = "zdbs.json";

    @expose
    async deploy(options: ZDB) {
        const zdbFactory = new zdb()
        const zdbWorkload = zdbFactory.create(options.name,
            options.namespace,
            options.disk_size,
            options.mode,
            options.password,
            options.disk_type,
            options.public,
            options.metadata,
            options.description)

        let deploymentFactory = new DeploymentFactory();
        let deployment = deploymentFactory.create([zdbWorkload], 1626394539, options.metadata, options.description)

        const twinDeployment = new TwinDeployment(deployment, Operations.deploy, 0, options.node_id)
        let twinDeploymentFactory = new TwinDeploymentFactory()
        const contracts = await twinDeploymentFactory.handle([twinDeployment])
        const data = this.save(options.name, contracts)
        return data
    }

    @expose
    async get(options) {
        return await this._get(options.name)
    }

    @expose
    async delete(options) {
        return await this._delete(options.name)
    }
}

export { Zdb as zdb }