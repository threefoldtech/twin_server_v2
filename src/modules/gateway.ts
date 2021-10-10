import { Gateway } from "grid3_client";
import { DeployGatewayFQDN, DeployGatewayName } from "grid3_client";
import { expose } from "../helpers/expose";
import { default as config } from "../../config.json";
import { getRMBClient } from "../clients/rmb";

class GatewayModule {
    gateway: Gateway;

    constructor() {
        const rmbClient = getRMBClient();
        this.gateway = new Gateway(config.twin_id, config.url, config.mnemonic, rmbClient);
    }

    @expose
    async deploy_fqdn(options: DeployGatewayFQDN) {
        return await this.gateway.deploy_fqdn(options);

    }

    @expose
    async deploy_name(options: DeployGatewayName) {
        return await this.gateway.deploy_name(options);
    }
}

export { GatewayModule as gateway };
