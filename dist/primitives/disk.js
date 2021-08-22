"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disk = void 0;
var disk = require("grid3_client/zos/zmount");
var workloads = require("grid3_client/zos/workload");
var Disk = /** @class */ (function () {
    function Disk() {
    }
    Disk.prototype.create = function (size, name, metadata, description, version) {
        var zmount = new disk.Zmount();
        zmount.size = 1024 * 1024 * 1024 * size;
        var zmount_workload = new workloads.Workload();
        zmount_workload.version = version || 0;
        zmount_workload.name = name;
        zmount_workload.type = workloads.WorkloadTypes.zmount;
        zmount_workload.data = zmount;
        zmount_workload.metadata = metadata;
        zmount_workload.description = description;
        return zmount_workload;
    };
    Disk.prototype.update = function (size, name, metadata, description, old_version) {
        return this.create(size, name, metadata, description, old_version + 1);
    };
    return Disk;
}());
exports.Disk = Disk;
