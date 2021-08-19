"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPv4 = void 0;
var ipv4 = require("grid3_client/zos/ipv4");
var workloads = require("grid3_client/zos/workload");
var IPv4 = /** @class */ (function () {
    function IPv4() {
    }
    IPv4.prototype.create = function (name, metadata, description, version) {
        var public_ip = new ipv4.PublicIP();
        var ipv4_workload = new workloads.Workload();
        ipv4_workload.version = version || 0;
        ipv4_workload.name = name;
        ipv4_workload.type = workloads.WorkloadTypes.ipv4;
        ipv4_workload.data = public_ip;
        ipv4_workload.metadata = metadata;
        ipv4_workload.description = description;
        return ipv4_workload;
    };
    IPv4.prototype.update = function (name, metadata, description, old_version) {
        return this.create(name, metadata, description, old_version + 1);
    };
    return IPv4;
}());
exports.IPv4 = IPv4;
