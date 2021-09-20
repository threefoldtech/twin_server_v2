"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    DeploymentFactory.prototype.UpdateDeployment = function (oldDeployment, newDeployment, network) {
        if (network === void 0) { network = null; }
        return __awaiter(this, void 0, void 0, function () {
            var oldWorkloadNames, newWorkloadNames, deletedWorkloads, newWorkloads, foundUpdate, deploymentVersion, _i, _a, workload, _b, _c, workload, _d, _e, workload, _f, _g, w, oldVersion, tfclient, contract, node_id, oldIp, newIp;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        oldWorkloadNames = [];
                        newWorkloadNames = [];
                        deletedWorkloads = [];
                        newWorkloads = [];
                        foundUpdate = false;
                        deploymentVersion = oldDeployment.version;
                        for (_i = 0, _a = oldDeployment.workloads; _i < _a.length; _i++) {
                            workload = _a[_i];
                            oldWorkloadNames.push(workload.name);
                        }
                        for (_b = 0, _c = newDeployment.workloads; _b < _c.length; _b++) {
                            workload = _c[_b];
                            newWorkloadNames.push(workload.name);
                        }
                        _d = 0, _e = oldDeployment.workloads;
                        _h.label = 1;
                    case 1:
                        if (!(_d < _e.length)) return [3 /*break*/, 8];
                        workload = _e[_d];
                        if (workload.type === grid3_client_1.WorkloadTypes.network) {
                            return [3 /*break*/, 7];
                        }
                        if (!newWorkloadNames.includes(workload.name)) {
                            deletedWorkloads.push(workload);
                            foundUpdate = true;
                            return [3 /*break*/, 7];
                        }
                        _f = 0, _g = newDeployment.workloads;
                        _h.label = 2;
                    case 2:
                        if (!(_f < _g.length)) return [3 /*break*/, 7];
                        w = _g[_f];
                        if (!oldWorkloadNames.includes(w.name)) {
                            w.version = deploymentVersion + 1;
                            newWorkloads.push(w);
                            oldWorkloadNames.push(w.name);
                            foundUpdate = true;
                            return [3 /*break*/, 6];
                        }
                        if (w.type === grid3_client_1.WorkloadTypes.network) {
                            return [3 /*break*/, 6];
                        }
                        if (w.name !== workload.name) {
                            return [3 /*break*/, 6];
                        }
                        oldVersion = workload.version;
                        workload.version = 0;
                        if (!(w.type === grid3_client_1.WorkloadTypes.zmachine)) return [3 /*break*/, 5];
                        tfclient = new grid3_client_1.TFClient(config_json_1.default.url, config_json_1.default.mnemonic);
                        return [4 /*yield*/, tfclient.connect()];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, tfclient.contracts.get(oldDeployment.contract_id)];
                    case 4:
                        contract = _h.sent();
                        node_id = contract["node_id"];
                        oldIp = workload.data["network"]["interfaces"][0]["ip"];
                        newIp = w.data["network"]["interfaces"][0]["ip"];
                        if (newIp !== oldIp) {
                            network.deleteReservedIp(node_id, newIp);
                            w.data["network"]["interfaces"][0]["ip"] = oldIp;
                        }
                        _h.label = 5;
                    case 5:
                        if (w.challenge() === workload.challenge()) {
                            workload.version = oldVersion;
                            return [3 /*break*/, 6];
                        }
                        workload.version = deploymentVersion + 1;
                        workload.data = w.data;
                        workload.description = w.description;
                        workload.metadata = w.metadata;
                        foundUpdate = true;
                        return [3 /*break*/, 7];
                    case 6:
                        _f++;
                        return [3 /*break*/, 2];
                    case 7:
                        _d++;
                        return [3 /*break*/, 1];
                    case 8:
                        // add new workloads 
                        oldDeployment.workloads = oldDeployment.workloads.concat(newWorkloads);
                        // remove the deleted workloads
                        oldDeployment.workloads = oldDeployment.workloads.filter(function (item) { return !deletedWorkloads.includes(item); });
                        if (!foundUpdate) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, oldDeployment];
                }
            });
        });
    };
    DeploymentFactory.prototype.fromObj = function (deployment) {
        var d = new grid3_client_1.Deployment();
        Object.assign(d, deployment);
        var signature_requirement = new grid3_client_1.SignatureRequirement();
        Object.assign(signature_requirement, d.signature_requirement);
        var requests = [];
        for (var _i = 0, _a = signature_requirement.requests; _i < _a.length; _i++) {
            var request = _a[_i];
            var r = new grid3_client_1.SignatureRequest();
            Object.assign(r, request);
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
