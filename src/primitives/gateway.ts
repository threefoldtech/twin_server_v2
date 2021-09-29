import { GatewayFQDNProxy, GatewayNameProxy, Workload, WorkloadTypes } from "grid3_client";

class GW {
    createFQDN(fqdn: string, tls_passthrough: boolean, backends: string[], name: string, metadata: string = "", description: string = "", version: number = 0): Workload {
        let fqdnObj = new GatewayFQDNProxy();
        fqdnObj.fqdn = fqdn;
        fqdnObj.tls_passthrough = tls_passthrough;
        fqdnObj.backends = backends;

        let fqdn_workload = new Workload();
        fqdn_workload.version = version
        fqdn_workload.name = name;
        fqdn_workload.type = WorkloadTypes.gatewayfqdnproxy;
        fqdn_workload.data = fqdnObj;
        fqdn_workload.metadata = metadata;
        fqdn_workload.description = description;

        return fqdn_workload
    }

    updateFQDN(fqdn: string, tls_passthrough: boolean, backends: string[], name: string, metadata: string = "", description: string = "", old_version: number = 1): Workload {
        return this.createFQDN(fqdn, tls_passthrough, backends, name, metadata, description, old_version + 1)
    }

    createName(name: string, tls_passthrough: boolean, backends: string[], metadata: string = "", description: string = "", version: number = 0): Workload {
        let nameOnj = new GatewayNameProxy();
        nameOnj.name = name;
        nameOnj.tls_passthrough = tls_passthrough;
        nameOnj.backends = backends;

        let name_workload = new Workload();
        name_workload.version = version
        name_workload.name = name;
        name_workload.type = WorkloadTypes.gatewaynameproxy;
        name_workload.data = nameOnj;
        name_workload.metadata = metadata;
        name_workload.description = description;

        return name_workload
    }

    updateName(name: string, tls_passthrough: boolean, backends: string[], metadata: string = "", description: string = "", old_version: number = 1): Workload {
        return this.createName(name, tls_passthrough, backends, metadata, description, old_version + 1)
    }
}
export { GW }