import { PublicIP, Workload, WorkloadTypes } from "grid3_client"

class IPv4 {

    create(name: string, metadata: string = "", description: string = "", version: number = 0): Workload {
        const public_ip = new PublicIP();
        let ipv4_workload = new Workload();
        ipv4_workload.version = version;
        ipv4_workload.name = name;
        ipv4_workload.type = WorkloadTypes.ipv4;
        ipv4_workload.data = public_ip;
        ipv4_workload.metadata = metadata;
        ipv4_workload.description = description;
        return ipv4_workload;
    }
    update(name: string, metadata: string = "", description: string = "", old_version: number = 1): Workload {
        return this.create(name, metadata, description, old_version + 1)
    }
}
export { IPv4 }