"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentFactory = void 0;
var grid3_client_1 = require("grid3_client");
var config_json_1 = __importDefault(require("../../config.json"));
var DeploymentFactory = /** @class */ (function () {
    function DeploymentFactory() {
    }
    DeploymentFactory.prototype.create = function (workloads, expiration, metadata, description, version) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (version === void 0) { version = 0; }
        var signature_request = new grid3_client_1.SignatureRequest();
        signature_request.twin_id = config_json_1.default.twin_id;
        signature_request.weight = 1;
        var signature_requirement = new grid3_client_1.SignatureRequirement();
        signature_requirement.weight_required = 1;
        signature_requirement.requests = [signature_request];
        var deployment = new grid3_client_1.Deployment();
        deployment.version = 0;
        deployment.metadata = metadata;
        deployment.description = description;
        deployment.twin_id = config_json_1.default.twin_id;
        deployment.expiration = expiration;
        deployment.workloads = workloads;
        deployment.signature_requirement = signature_requirement;
        return deployment;
    };
    DeploymentFactory.prototype.fromObj = function (deployment) {
        var d = new grid3_client_1.Deployment();
        Object.assign(d, deployment);
        var signature_requirement = new grid3_client_1.SignatureRequirement();
        Object.assign(signature_requirement, d.signature_requirement);
        var requests = [];
        for (var _i = 0, _a = signature_requirement.requests; _i < _a.length; _i++) {
            var request_1 = _a[_i];
            var r = new grid3_client_1.SignatureRequest();
            Object.assign(r, request_1);
            requests.push(r);
        }
        signature_requirement.requests = requests;
        d.signature_requirement = signature_requirement;
        var workloads = [];
        for (var _b = 0, _c = d.workloads; _b < _c.length; _b++) {
            var workload = _c[_b];
            var w = new grid3_client_1.Workload();
            Object.assign(w, workload);
            if (workload.type === grid3_client_1.WorkloadTypes.ipv4) {
                var ipv4 = new grid3_client_1.PublicIP();
                Object.assign(ipv4, w.data);
                w.data = ipv4;
                workloads.push(w);
            }
            else if (workload.type === grid3_client_1.WorkloadTypes.zdb) {
                var zdb = new grid3_client_1.Zdb();
                Object.assign(zdb, w.data);
                w.data = zdb;
                workloads.push(w);
            }
            else if (workload.type === grid3_client_1.WorkloadTypes.network) {
                var znet = new grid3_client_1.Znet();
                Object.assign(znet, w.data);
                var peers = [];
                for (var _d = 0, _e = znet.peers; _d < _e.length; _d++) {
                    var peer = _e[_d];
                    var p = new grid3_client_1.Peer();
                    Object.assign(p, peer);
                    peers.push(p);
                }
                znet.peers = peers;
                w.data = znet;
                workloads.push(w);
            }
            else if (workload.type === grid3_client_1.WorkloadTypes.zmount) {
                var zmount = new grid3_client_1.Zmount();
                Object.assign(zmount, w.data);
                w.data = zmount;
                workloads.push(w);
            }
            else if (workload.type === grid3_client_1.WorkloadTypes.zmachine) {
                var zmachine = new grid3_client_1.Zmachine();
                Object.assign(zmachine, w.data);
                var net = new grid3_client_1.ZmachineNetwork();
                Object.assign(net, zmachine.network);
                zmachine.network = net;
                var computeCapacity = new grid3_client_1.ComputeCapacity();
                Object.assign(computeCapacity, zmachine.compute_capacity);
                zmachine.compute_capacity = computeCapacity;
                var mounts = [];
                for (var _f = 0, _g = zmachine.mounts; _f < _g.length; _f++) {
                    var mount = _g[_f];
                    var m = new grid3_client_1.Mount();
                    Object.assign(m, mount);
                    mounts.push(m);
                }
                zmachine.mounts = mounts;
                w.data = zmachine;
                workloads.push(w);
            }
        }
        d.workloads = workloads;
        return d;
    };
    return DeploymentFactory;
}());
exports.DeploymentFactory = DeploymentFactory;
