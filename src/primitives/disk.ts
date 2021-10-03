import { Zmount, Workload, WorkloadTypes, Mount } from "grid3_client";

class Disk {
    createMount(name: string, mountpoint: string): Mount {
        const mount = new Mount();
        mount.name = name;
        mount.mountpoint = mountpoint;
        return mount;
    }
    create(size: number, name: string, metadata = "", description = "", version = 0): Workload {
        const zmount = new Zmount();
        zmount.size = 1024 * 1024 * 1024 * size;

        const zmount_workload = new Workload();
        zmount_workload.version = version;
        zmount_workload.name = name;
        zmount_workload.type = WorkloadTypes.zmount;
        zmount_workload.data = zmount;
        zmount_workload.metadata = metadata;
        zmount_workload.description = description;
        return zmount_workload;
    }
    update(size: number, name: string, metadata = "", description = "", old_version = 1): Workload {
        return this.create(size, name, metadata, description, old_version + 1);
    }
}
export { Disk };
