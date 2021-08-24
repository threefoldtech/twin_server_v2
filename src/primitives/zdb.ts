import { Zdb, Workload, WorkloadTypes, ZdbModes, DeviceTypes } from "grid3_client";

class zdb {
    create(name: string, namespace: string, size: number, mode: ZdbModes = ZdbModes.seq, password: string, type: DeviceTypes = DeviceTypes.hdd, pub: boolean, metadata: string = "", description: string = "", version: number = 0): Workload {
        let zdb = new Zdb();
        zdb.namespace = namespace;
        zdb.size = size;
        zdb.mode = mode;
        zdb.password = password;
        zdb.disk_type = type;
        zdb.public = pub;

        let zdb_workload = new Workload();
        zdb_workload.version = version;
        zdb_workload.name = name;
        zdb_workload.type = WorkloadTypes.zdb;
        zdb_workload.data = zdb;
        zdb_workload.metadata = metadata;
        zdb_workload.description = description;
        return zdb_workload;
    }
    update(name: string, namespace: string, size: number, mode: ZdbModes = ZdbModes.seq, password: string, type: DeviceTypes = DeviceTypes.hdd, pub: boolean, metadata: string = "", description: string = "", version: number = 1): Workload {
        return this.create(name, namespace, size, mode, password, type, pub, metadata, description, version)
    }
}
export { zdb }