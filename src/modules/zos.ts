import { WorkloadTypes } from "grid3_client";

import { ZOS } from "./models";
import { expose } from "../helpers/index";
import { default as config } from "../../config.json";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";
import { DeploymentFactory } from "../primitives/deployment";

class Zos {
    @expose
    async deploy(options: ZOS) {
        // get node_id from the deployment
        const node_id = options.node_id;
        delete options.node_id;

        const deploymentFactory = new DeploymentFactory();
        const deployment = deploymentFactory.fromObj(options);
        deployment.sign(deployment.twin_id, config.mnemonic);

        let publicIps = 0;
        for (const workload of deployment.workloads) {
            if (workload.type === WorkloadTypes.ipv4) {
                publicIps++;
            }
        }
        const twinDeploymentHandler = new TwinDeploymentHandler();
        return await twinDeploymentHandler.deploy(deployment, node_id, publicIps);
    }
}

export { Zos as zos };
