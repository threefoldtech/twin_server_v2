import { Deployment, Workload, SignatureRequest, SignatureRequirement } from "grid3_client"

import { default as config } from "../../config.json"


class DeploymentFactory {
    create(workloads: Workload[], expiration: number, metadata: string = "", description: string = "", version: number = 0): Deployment {
        let signature_request = new SignatureRequest();
        signature_request.twin_id = config.twin_id;
        signature_request.weight = 1;

        let signature_requirement = new SignatureRequirement();
        signature_requirement.weight_required = 1;
        signature_requirement.requests = [signature_request];

        let deployment = new Deployment();
        deployment.version = 0;
        deployment.metadata = metadata
        deployment.description = description
        deployment.twin_id = config.twin_id;
        deployment.expiration = expiration;
        deployment.workloads = workloads;
        deployment.signature_requirement = signature_requirement;

        return deployment
    }
}
export { DeploymentFactory }