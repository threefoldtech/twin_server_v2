const ipv4 = require("grid3_client/zos/ipv4")
const workloads = require("grid3_client/zos/workload")

class IPv4 {

    create(name, metadata, description, version) {
        const public_ip = new ipv4.PublicIP();
        let ipv4_workload = new workloads.Workload();
        ipv4_workload.version = version || 0;
        ipv4_workload.name = name;
        ipv4_workload.type = workloads.WorkloadTypes.ipv4;
        ipv4_workload.data = public_ip;
        ipv4_workload.metadata = metadata;
        ipv4_workload.description = description;
        return ipv4_workload;
    }
    update(name, metadata, description, old_version) {
        return this.create(name, metadata, description, old_version + 1)
    }
}
export { IPv4 }