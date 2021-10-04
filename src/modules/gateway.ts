import { BaseModule } from "./base";
import { DeployGatewayFQDN, DeployGatewayName } from "./models";
import { GatewayHL } from "grid3_client";
import { expose } from "../helpers/expose";
import { default as config } from "../../config.json";

class Gateway extends BaseModule {
    fileName = "gateway.json";
    gateway: GatewayHL;

    constructor() {
        super();
        this.gateway = new GatewayHL(config.twin_id, config.url, config.mnemonic, this.rmbClient);
    }

    @expose
    async deploy_fqdn(options: DeployGatewayFQDN) {
        if (this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = await this.gateway.create(
            options.name,
            options.node_id,
            options.tls_passthrough,
            options.backends,
            options.fqdn,
        );
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }

    @expose
    async deploy_name(options: DeployGatewayName) {
        if (this.exists(options.name)) {
            throw Error(`Another gateway deployment with the same name ${options.name} is already exist`);
        }
        const twinDeployments = await this.gateway.create(
            options.name,
            options.node_id,
            options.tls_passthrough,
            options.backends,
        );
        const contracts = await this.twinDeploymentHandler.handle(twinDeployments);
        this.save(options.name, contracts);
        return { contracts: contracts };
    }
}

export { Gateway as gateway };
