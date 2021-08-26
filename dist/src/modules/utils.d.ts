import { Deployment } from "grid3_client";
declare function createContractAndSendToZos(deployment: Deployment, node_id: number, node_twin_id: number, hash: string, publicIPs: number): Promise<any>;
export { createContractAndSendToZos };
