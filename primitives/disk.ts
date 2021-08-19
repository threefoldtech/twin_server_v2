const disk = require("grid3_client/zos/zmount")
const workloads = require("grid3_client/zos/workload")

class Disk {

    create(size, name, metadata, description, version) {
        let zmount = new disk.Zmount();
        zmount.size = 1024 * 1024 * 1024 * size;

        let zmount_workload = new workloads.Workload();
        zmount_workload.version = version || 0;
        zmount_workload.name = name;
        zmount_workload.type = workloads.WorkloadTypes.zmount;
        zmount_workload.data = zmount;
        zmount_workload.metadata = metadata;
        zmount_workload.description = description;
        return zmount_workload;
    }
    update(size, name, metadata, description, old_version) {
        return this.create(size, name, metadata, description, old_version + 1)
    }
}
export { Disk }