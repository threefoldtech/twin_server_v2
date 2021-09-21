import { DeviceTypes, ZdbModes, Deployment, WorkloadTypes } from "grid3_client";

import { HighLevelBase } from "./base";
import { zdb } from "../primitives/zdb";
import { DeploymentFactory } from "../primitives/deployment";
import { TwinDeployment, Operations } from "../high_level/models";

class Zdb extends HighLevelBase {
    create(
        name: string,
        node_id: number,
        namespace: string,
        disk_size: number,
        disk_type: DeviceTypes,
        mode: ZdbModes,
        password: string,
        publicIpv6: boolean,
        metadata = "",
        description = "",
    ) {
        const deploymentFactory = new DeploymentFactory();
        const zdbFactory = new zdb();
        const zdbWorkload = zdbFactory.create(
            name,
            namespace,
            disk_size,
            mode,
            password,
            disk_type,
            publicIpv6,
            metadata,
            description,
        );
        const deployment = deploymentFactory.create([zdbWorkload], 1626394539, metadata, description);
        return new TwinDeployment(deployment, Operations.deploy, 0, node_id);
    }
    async delete(deployment: Deployment, names: string[]) {
        return await this._delete(deployment, names, [WorkloadTypes.zdb]);
    }
}
export { Zdb };
