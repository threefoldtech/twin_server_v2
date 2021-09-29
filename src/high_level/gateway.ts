import { Deployment, WorkloadTypes } from "grid3_client"

import { TwinDeployment, Operations } from "./models"
import { HighLevelBase } from "./base"
import { GW, DeploymentFactory } from "../primitives/index"

class GatewayHL extends HighLevelBase {
    async create(name: string,
        node_id:number,
        tls_passthrough: boolean,
        backends: string[],
        fqdn: string = "",
        metadata: string = "",
        description: string = ""): Promise<TwinDeployment[]> {
            const public_ips = 0
            const gw = new GW()
            let workloads = []
            if (fqdn != ""){
                workloads.push(gw.createFQDN(fqdn,tls_passthrough, backends,name,metadata,description));
            }else{
                workloads.push(gw.createName(name,tls_passthrough,backends,metadata,description));
            }
            let deploymentFactory = new DeploymentFactory();
            let deployment = deploymentFactory.create(workloads, 1626394539, metadata, description);
            let twinDeployments = []
            twinDeployments.push(new TwinDeployment(deployment, Operations.deploy, public_ips, node_id));
            return twinDeployments;
        }
}
export { GatewayHL }