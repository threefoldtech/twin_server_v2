import { BaseModule } from "./base";
import { DeployGatewayFQDN, DeployGatewayName } from "./models";
import { GatewayHL } from "../high_level/gateway";
import { expose } from "../helpers/expose";
import { TwinDeploymentHandler } from "../high_level/twinDeploymentHandler";

class Gateway extends BaseModule {
    fileName = "gateway.json";

    @expose
    async deploy_fqdn(options: DeployGatewayFQDN) {
        if (this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
        }
        const fqdn = new GatewayHL();
        const twinDeployments = await fqdn.create(
            options.name,
            options.node_id,
            options.tls_passthrough,
            options.backends,
            options.fqdn,
        );
        const twinDeploymentHandler = new TwinDeploymentHandler();
        const contracts = await twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }

    @expose
    async deploy_name(options: DeployGatewayName) {
        if (this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
        }
        const name = new GatewayHL();
        const twinDeployments = await name.create(
            options.name,
            options.node_id,
            options.tls_passthrough,
            options.backends,
        );
        const twinDeploymentHandler = new TwinDeploymentHandler();
        const contracts = await twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }
}

export { Gateway as gateway };
