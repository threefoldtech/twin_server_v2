import { BaseModule } from "./base"
import { ZDBS } from "./models"
import { expose } from "../helpers/expose"
import { zdb } from "../primitives/zdb"
import { generateString } from "../helpers/utils"
import { DeploymentFactory } from "../primitives/deployment"
import { TwinDeployment, Operations } from "../high_level/models"
import { TwinDeploymentFactory } from "../high_level/twinDeploymentFactory"

class Zdbs extends BaseModule {
    fileName: string = "zdbs.json";

    @expose
    async deploy(options: ZDBS) {
        if (this.exists(options.name)) {
            throw Error(`Another zdb deployment with the same name ${options.name} is already exist`)
        }
        let deploymentFactory = new DeploymentFactory();
        const zdbFactory = new zdb()
        let twinDeployments = []
        for (const instance of options.zdbs) {
            const zdbWorkload = zdbFactory.create(instance.name,
                instance.namespace,
                instance.disk_size,
                instance.mode,
                instance.password,
                instance.disk_type,
                instance.public,
                options.metadata,
                options.description)
            let deployment = deploymentFactory.create([zdbWorkload], 1626394539, options.metadata, options.description)
            twinDeployments.push(new TwinDeployment(deployment, Operations.deploy, 0, instance.node_id))
        }

        let twinDeploymentFactory = new TwinDeploymentFactory()
        const contracts = await twinDeploymentFactory.handle(twinDeployments)
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

export { Zdbs as zdbs }