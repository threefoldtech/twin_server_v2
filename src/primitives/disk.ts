
import { Zmount, Workload, WorkloadTypes, Mount } from "grid3_client"


class Disk {

    createMount(name: string, mountpoint: string): Mount {
        let mount = new Mount();
        mount.name = name;
        mount.mountpoint = mountpoint;
        return mount;
    }
    create(size: number, name: string, metadata: string = "", description: string = "", version: number = 0): Workload {
        let zmount = new Zmount();
        zmount.size = 1024 * 1024 * 1024 * size;

        let zmount_workload = new Workload();
        zmount_workload.version = version;
        zmount_workload.name = name;
        zmount_workload.type = WorkloadTypes.zmount;
        zmount_workload.data = zmount;
        zmount_workload.metadata = metadata;
        zmount_workload.description = description;
        return zmount_workload;
    }
    update(size: number, name: string, metadata: string = "", description: string = "", old_version: number = 1): Workload {
        return this.create(size, name, metadata, description, old_version + 1)
    }
}
export { Disk }