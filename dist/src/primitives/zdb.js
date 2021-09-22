"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zdb = void 0;
const grid3_client_1 = require("grid3_client");
class zdb {
    create(name, namespace, size, mode = grid3_client_1.ZdbModes.seq, password, type = grid3_client_1.DeviceTypes.hdd, pub, metadata = "", description = "", version = 0) {
        const zdb = new grid3_client_1.Zdb();
        zdb.namespace = namespace;
        zdb.size = size;
        zdb.mode = mode;
        zdb.password = password;
        zdb.disk_type = type;
        zdb.public = pub;
        const zdb_workload = new grid3_client_1.Workload();
        zdb_workload.version = version;
        zdb_workload.name = name;
        zdb_workload.type = grid3_client_1.WorkloadTypes.zdb;
        zdb_workload.data = zdb;
        zdb_workload.metadata = metadata;
        zdb_workload.description = description;
        return zdb_workload;
    }
    update(name, namespace, size, mode = grid3_client_1.ZdbModes.seq, password, type = grid3_client_1.DeviceTypes.hdd, pub, metadata = "", description = "", version = 1) {
        return this.create(name, namespace, size, mode, password, type, pub, metadata, description, version);
    }
}
exports.zdb = zdb;
