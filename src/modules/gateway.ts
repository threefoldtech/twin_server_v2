import { GWModule, DeployGatewayFQDNModel, DeployGatewayNameModel } from "grid3_client";

import { expose } from "../helpers/expose";
import { Base } from "./base";

class Gateway extends Base {
    gateway: GWModule;

    constructor() {
        super();
        this.gateway = this.client.gateway;
    }

    @expose
    async deploy_fqdn(options: DeployGatewayFQDNModel) {
        return await this.gateway.deploy_fqdn(options);
    }

    @expose
    async deploy_name(options: DeployGatewayNameModel) {
        return await this.gateway.deploy_name(options);
    }
}

export { Gateway as gateway };
