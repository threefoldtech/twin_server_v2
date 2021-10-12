import { GWModule } from "grid3_client";
import { DeployGatewayFQDNModel, DeployGatewayNameModel } from "grid3_client";
import { expose } from "../helpers/expose";
import { default as config } from "../../config.json";
import { getRMBClient } from "../clients/rmb";

class Gateway {
    gateway: GWModule;

    constructor() {
        const rmbClient = getRMBClient();
        this.gateway = new GWModule(config.twin_id, config.url, config.mnemonic, rmbClient);
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
