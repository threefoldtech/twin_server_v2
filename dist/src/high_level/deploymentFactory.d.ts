import { TFClient, Deployment, MessageBusClient } from "grid3_client";
import { TwinDeployment } from "./models";
import { Network } from "../primitives/index";
declare class DeploymentFactory {
    tfclient: TFClient;
    rmb: MessageBusClient;
    constructor();
    createContractAndSendToZos(deployment: Deployment, node_id: number, hash: string, publicIPs: number): Promise<any>;
    deploy(deployments: TwinDeployment[], network: Network): Promise<any[]>;
}
export { DeploymentFactory };
