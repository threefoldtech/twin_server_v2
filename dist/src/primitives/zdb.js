"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zdb = void 0;
var grid3_client_1 = require("grid3_client");
var zdb = /** @class */ (function () {
    function zdb() {
    }
    zdb.prototype.create = function (name, namespace, size, mode, password, type, pub, metadata, description, version) {
        if (mode === void 0) { mode = grid3_client_1.ZdbModes.seq; }
        if (type === void 0) { type = grid3_client_1.DeviceTypes.hdd; }
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (version === void 0) { version = 0; }
        var zdb = new grid3_client_1.Zdb();
        zdb.namespace = namespace;
        zdb.size = size;
        zdb.mode = mode;
        zdb.password = password;
        zdb.disk_type = type;
        zdb.public = pub;
        var zdb_workload = new grid3_client_1.Workload();
        zdb_workload.version = version;
        zdb_workload.name = name;
        zdb_workload.type = grid3_client_1.WorkloadTypes.zdb;
        zdb_workload.data = zdb;
        zdb_workload.metadata = metadata;
        zdb_workload.description = description;
        return zdb_workload;
    };
    zdb.prototype.update = function (name, namespace, size, mode, password, type, pub, metadata, description, version) {
        if (mode === void 0) { mode = grid3_client_1.ZdbModes.seq; }
        if (type === void 0) { type = grid3_client_1.DeviceTypes.hdd; }
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (version === void 0) { version = 1; }
        return this.create(name, namespace, size, mode, password, type, pub, metadata, description, version);
    };
    return zdb;
}());
exports.zdb = zdb;
