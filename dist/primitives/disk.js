"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disk = void 0;
var grid3_client_1 = require("grid3_client");
var Disk = /** @class */ (function () {
    function Disk() {
    }
    Disk.prototype.createMount = function (name, mountpoint) {
        var mount = new grid3_client_1.Mount();
        mount.name = name;
        mount.mountpoint = mountpoint;
        return mount;
    };
    Disk.prototype.create = function (size, name, metadata, description, version) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (version === void 0) { version = 0; }
        var zmount = new grid3_client_1.Zmount();
        zmount.size = 1024 * 1024 * 1024 * size;
        var zmount_workload = new grid3_client_1.Workload();
        zmount_workload.version = version;
        zmount_workload.name = name;
        zmount_workload.type = grid3_client_1.WorkloadTypes.zmount;
        zmount_workload.data = zmount;
        zmount_workload.metadata = metadata;
        zmount_workload.description = description;
        return zmount_workload;
    };
    Disk.prototype.update = function (size, name, metadata, description, old_version) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (old_version === void 0) { old_version = 1; }
        return this.create(size, name, metadata, description, old_version + 1);
    };
    return Disk;
}());
exports.Disk = Disk;
