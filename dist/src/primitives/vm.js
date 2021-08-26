"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VM = void 0;
var grid3_client_1 = require("grid3_client");
var VM = /** @class */ (function () {
    function VM() {
    }
    VM.prototype._createComputeCapacity = function (cpu, memory) {
        var compute_capacity = new grid3_client_1.ComputeCapacity();
        compute_capacity.cpu = cpu;
        compute_capacity.memory = 1024 * 1024 * memory;
        return compute_capacity;
    };
    VM.prototype._createNetworkInterface = function (networkName, ip) {
        var znetwork_interface = new grid3_client_1.ZNetworkInterface();
        znetwork_interface.network = networkName;
        znetwork_interface.ip = ip;
        return znetwork_interface;
    };
    VM.prototype._createMachineNetwork = function (networkName, ip, planetary, public_ip) {
        if (public_ip === void 0) { public_ip = ""; }
        var zmachine_network = new grid3_client_1.ZmachineNetwork();
        zmachine_network.planetary = planetary;
        zmachine_network.interfaces = [this._createNetworkInterface(networkName, ip)];
        zmachine_network.public_ip = public_ip;
        return zmachine_network;
    };
    VM.prototype.create = function (name, flist, cpu, memory, disks, networkName, ip, planetary, public_ip, entrypoint, env, metadata, description, version) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (version === void 0) { version = 0; }
        var zmachine = new grid3_client_1.Zmachine();
        zmachine.flist = flist;
        zmachine.network = this._createMachineNetwork(networkName, ip, planetary, public_ip);
        zmachine.size = 1;
        zmachine.mounts = disks;
        zmachine.entrypoint = entrypoint;
        zmachine.compute_capacity = this._createComputeCapacity(cpu, memory);
        zmachine.env = env;
        var zmachine_workload = new grid3_client_1.Workload();
        zmachine_workload.version = version || 0;
        zmachine_workload.name = name;
        zmachine_workload.type = grid3_client_1.WorkloadTypes.zmachine;
        zmachine_workload.data = zmachine;
        zmachine_workload.metadata = metadata;
        zmachine_workload.description = description;
        return zmachine_workload;
    };
    return VM;
}());
exports.VM = VM;
