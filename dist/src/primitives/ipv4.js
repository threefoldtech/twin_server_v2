"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPv4 = void 0;
var grid3_client_1 = require("grid3_client");
var IPv4 = /** @class */ (function () {
    function IPv4() {
    }
    IPv4.prototype.create = function (name, metadata, description, version) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (version === void 0) { version = 0; }
        var public_ip = new grid3_client_1.PublicIP();
        var ipv4_workload = new grid3_client_1.Workload();
        ipv4_workload.version = version;
        ipv4_workload.name = name;
        ipv4_workload.type = grid3_client_1.WorkloadTypes.ipv4;
        ipv4_workload.data = public_ip;
        ipv4_workload.metadata = metadata;
        ipv4_workload.description = description;
        return ipv4_workload;
    };
    IPv4.prototype.update = function (name, metadata, description, old_version) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (old_version === void 0) { old_version = 1; }
        return this.create(name, metadata, description, old_version + 1);
    };
    return IPv4;
}());
exports.IPv4 = IPv4;
