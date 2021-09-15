import { BaseModule } from "./base"
import { ZDBS, DeleteZDB, AddZDB } from "./models"
import { Zdb } from "../high_level/zdb"
import { expose } from "../helpers/expose"
import { DeploymentFactory } from "../primitives/deployment"
import { TwinDeployment, Operations } from "../high_level/models"
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler"

class Zdbs extends BaseModule {
    fileName: string = "zdbs.json";

    @expose
    async deploy(options: ZDBS) {
        if (this.exists(options.name)) {
            throw Error(`Another zdb deployment with the same name ${options.name} is already exist`)
        }
        const zdbFactory = new Zdb()
        let twinDeployments = []
        for (const instance of options.zdbs) {
            const twinDeployment = zdbFactory.create(instance.name,
                instance.node_id,
                instance.namespace,
                instance.disk_size,
                instance.disk_type,
                instance.mode,
                instance.password,
                instance.public,
                options.metadata,
                options.description)
            twinDeployments.push(twinDeployment)
        }

        let twinDeploymentHandler = new TwinDeploymentHandler()
        const contracts = await twinDeploymentHandler.handle(twinDeployments)
        this.save(options.name, contracts)
        return { "contracts": contracts }
    }

    @expose
    list() {
        return this._list()
    }

    @expose
    async get(options) {
        return await this._get(options.name)
    }

    @expose
    async delete(options) {
        return await this._delete(options.name)
    }

    @expose
    async update(options: ZDBS) {
        if (!this.exists(options.name)) {
            throw Error(`There is no zdb deployment with name: ${options.name}`)
        }
        let deploymentFactory = new DeploymentFactory();
        const zdbFactory = new Zdb()
        let twinDeployments = []
        for (const instance of options.zdbs) {
            const twinDeployment = zdbFactory.create(instance.name,
                instance.node_id,
                instance.namespace,
                instance.disk_size,
                instance.disk_type,
                instance.mode,
                instance.password,
                instance.public,
                options.metadata,
                options.description)
            twinDeployments.push(twinDeployment)
        }

        let finalTwinDeployments = []
        let twinDeploymentHandler = new TwinDeploymentHandler()
        twinDeployments = twinDeploymentHandler.deployMerge(twinDeployments)
        const deploymentNodeIds = this._getDeploymentNodeIds(options.name)
        finalTwinDeployments = twinDeployments.filter(d => !deploymentNodeIds.includes(d.nodeId))


        let deploymentObjs = await this._get(options.name)
        for (const deploymentObj of deploymentObjs) {
            let oldDeployment = deploymentFactory.fromObj(deploymentObj)
            const node_id = this._getNodeIdFromContractId(options.name, oldDeployment.contract_id)
            let deploymentFound = false
            for (const twinDeployment of twinDeployments) {
                if (twinDeployment.nodeId !== node_id) {
                    continue
                }
                oldDeployment = deploymentFactory.UpdateDeployment(oldDeployment, twinDeployment.deployment)
                deploymentFound = true
                if (!oldDeployment) {
                    continue
                }
                finalTwinDeployments.push(new TwinDeployment(oldDeployment, Operations.update, 0, 0))
                break
            }
            if (!deploymentFound) {
                finalTwinDeployments.push(new TwinDeployment(oldDeployment, Operations.delete, 0, 0))
            }
        }
        const contracts = await twinDeploymentHandler.handle(finalTwinDeployments)
        if (contracts.created.length === 0 && contracts.updated.length === 0 && contracts.deleted.length === 0) {
            return "Nothing found to update"
        }
        this.save(options.name, contracts)
        return { "contracts": contracts }
    }

    @expose
    async add_zdb(options: AddZDB) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`)
        }
        let deploymentObjs = await this._get(options.deployment_name)
        let deploymentFactory = new DeploymentFactory();
        const zdbFactory = new Zdb()
        const twinDeployment = zdbFactory.create(options.name,
            options.node_id,
            options.namespace,
            options.disk_size,
            options.disk_type,
            options.mode,
            options.password,
            options.public,
            deploymentObjs[0].metadata,
            deploymentObjs[0].metadata)

        const contract_id = this._getContractIdFromNodeId(options.deployment_name, options.node_id)
        if (contract_id) {
            for (const deploymentObj of deploymentObjs) {
                let oldDeployment = deploymentFactory.fromObj(deploymentObj)
                if (oldDeployment.contract_id !== contract_id) {
                    continue
                }
                let newDeployment = deploymentFactory.fromObj(deploymentObj)
                newDeployment.workloads = newDeployment.workloads.concat(twinDeployment.deployment.workloads)
                const deployment = deploymentFactory.UpdateDeployment(oldDeployment, newDeployment)
                twinDeployment.deployment = deployment
                twinDeployment.operation = Operations.update
                break
            }
        }

        let twinDeploymentHandler = new TwinDeploymentHandler()
        const contracts = await twinDeploymentHandler.handle([twinDeployment])
        this.save(options.deployment_name, contracts)
        return { "contracts": contracts }
    }

    @expose
    async delete_zdb(options: DeleteZDB) {
        if (!this.exists(options.deployment_name)) {
            throw Error(`There is no zdb deployment with name: ${options.deployment_name}`)
        }
        const zdb = new Zdb()
        let deployments = await this._get(options.deployment_name)
        for (const deployment of deployments) {
            const contracts = await zdb.delete(deployment, [options.name])
            if (contracts["deleted"].length > 0 || contracts["updated"].length > 0) {
                return contracts
            }
        }
        throw Error(`zdb instance with name ${options.name} is not found`)
    }
}

export { Zdbs as zdbs }