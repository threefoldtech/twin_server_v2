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
exports.HighLevelBase = void 0;
var grid3_client_1 = require("grid3_client");
var netaddr_1 = require("netaddr");
var deployment_1 = require("../primitives/deployment");
var network_1 = require("../primitives/network");
var models_1 = require("../high_level/models");
var config_json_1 = __importDefault(require("../../config.json"));
var HighLevelBase = /** @class */ (function () {
    function HighLevelBase() {
    }
    HighLevelBase.prototype._filterWorkloads = function (deployment, names, types) {
        if (types === void 0) { types = [grid3_client_1.WorkloadTypes.ipv4, grid3_client_1.WorkloadTypes.zmachine, grid3_client_1.WorkloadTypes.zmount, grid3_client_1.WorkloadTypes.zdb]; }
        var deletedMachineWorkloads = [];
        if (names.length === 0) {
            deletedMachineWorkloads = deployment.workloads.filter(function (item) { return item.type === grid3_client_1.WorkloadTypes.zmachine; });
        }
        if (names.length !== 0 && types.includes(grid3_client_1.WorkloadTypes.zmachine)) {
            var Workloads = deployment.workloads.filter(function (item) { return item.type === grid3_client_1.WorkloadTypes.zmachine; });
            for (var _i = 0, Workloads_1 = Workloads; _i < Workloads_1.length; _i++) {
                var workload = Workloads_1[_i];
                if (!names.includes(workload.name)) {
                    continue;
                }
                for (var _a = 0, _b = workload.data["mounts"]; _a < _b.length; _a++) {
                    var mount = _b[_a];
                    names.push(mount.name);
                }
                names.push(workload.data["network"].public_ip);
                deletedMachineWorkloads.push(workload);
            }
        }
        var remainingWorkloads = [];
        for (var _c = 0, _d = deployment.workloads; _c < _d.length; _c++) {
            var workload = _d[_c];
            if (workload.type === grid3_client_1.WorkloadTypes.network) {
                remainingWorkloads.push(workload);
                continue;
            }
            if (!types.includes(workload.type)) {
                remainingWorkloads.push(workload);
                continue;
            }
            if (names.length !== 0 && !names.includes(workload.name)) {
                remainingWorkloads.push(workload);
            }
        }
        return [remainingWorkloads, deletedMachineWorkloads];
    };
    HighLevelBase.prototype._deleteMachineNetwork = function (deployment, remainingWorkloads, deletedMachineWorkloads, node_id) {
        return __awaiter(this, void 0, void 0, function () {
            var twinDeployments, deploymentFactory, _loop_1, _i, deletedMachineWorkloads_1, workload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        twinDeployments = [];
                        deploymentFactory = new deployment_1.DeploymentFactory();
                        _loop_1 = function (workload) {
                            var networkName, networkIpRange, network, contract_id, _b, _c, d, d;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        networkName = workload.data["network"].interfaces[0].network;
                                        networkIpRange = netaddr_1.Addr(workload.data["network"].interfaces[0].ip).mask(16).toString();
                                        network = new network_1.Network(networkName, networkIpRange);
                                        return [4 /*yield*/, network.load(true)];
                                    case 1:
                                        _d.sent();
                                        network.deleteReservedIp(node_id, workload.data["network"].interfaces[0].ip);
                                        if (network.getNodeReservedIps(node_id).length !== 0) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        if (network.hasAccessPoint(node_id) && network.nodes.length !== 1) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        contract_id = network.deleteNode(node_id);
                                        if (contract_id === deployment.contract_id) {
                                            if (remainingWorkloads.length === 1) {
                                                twinDeployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.delete, 0, 0));
                                                remainingWorkloads = [];
                                            }
                                            else {
                                                remainingWorkloads = remainingWorkloads.filter(function (item) { return item.name !== networkName; });
                                            }
                                        }
                                        else {
                                            // check that the deployment doesn't have another workloads
                                            for (_b = 0, _c = network.deployments; _b < _c.length; _b++) {
                                                d = _c[_b];
                                                d = deploymentFactory.fromObj(d);
                                                if (d.contract_id !== contract_id) {
                                                    continue;
                                                }
                                                if (d.workloads.length === 1) {
                                                    twinDeployments.push(new models_1.TwinDeployment(d, models_1.Operations.delete, 0, 0));
                                                }
                                                else {
                                                    d.workloads = d.workloads.filter(function (item) { return item.name !== networkName; });
                                                    twinDeployments.push(new models_1.TwinDeployment(d, models_1.Operations.update, 0, 0));
                                                }
                                            }
                                        }
                                        // in case of the network got more accesspoints on different nodes this won't be valid
                                        if (network.nodes.length === 1 && network.getNodeReservedIps(network.nodes[0].node_id).length === 0) {
                                            network.deleteNode(network.nodes[0].node_id);
                                            d = deploymentFactory.fromObj(network.deployments[0]);
                                            if (d.workloads.length === 1) {
                                                twinDeployments.push(new models_1.TwinDeployment(d, models_1.Operations.delete, 0, 0));
                                            }
                                            else {
                                                d.workloads = d.workloads.filter(function (item) { return item.name !== networkName; });
                                                twinDeployments.push(new models_1.TwinDeployment(d, models_1.Operations.update, 0, 0));
                                            }
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, deletedMachineWorkloads_1 = deletedMachineWorkloads;
                        _a.label = 1;
                    case 1:
                        if (!(_i < deletedMachineWorkloads_1.length)) return [3 /*break*/, 4];
                        workload = deletedMachineWorkloads_1[_i];
                        return [5 /*yield**/, _loop_1(workload)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, [twinDeployments, remainingWorkloads]];
                }
            });
        });
    };
    HighLevelBase.prototype._delete = function (deployment, names, types) {
        if (types === void 0) { types = [grid3_client_1.WorkloadTypes.ipv4, grid3_client_1.WorkloadTypes.zmachine, grid3_client_1.WorkloadTypes.zmount, grid3_client_1.WorkloadTypes.zdb]; }
        return __awaiter(this, void 0, void 0, function () {
            var tfclient, twinDeployments, deploymentFactory, contract, node_id, numberOfWorkloads, _a, remainingWorkloads, deletedMachineWorkloads, _b, newTwinDeployments, newRemainingWorkloads;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (types.includes(grid3_client_1.WorkloadTypes.network)) {
                            throw Error("network can't be deleted");
                        }
                        tfclient = new grid3_client_1.TFClient(config_json_1.default.url, config_json_1.default.mnemonic);
                        return [4 /*yield*/, tfclient.connect()];
                    case 1:
                        _c.sent();
                        twinDeployments = [];
                        deploymentFactory = new deployment_1.DeploymentFactory();
                        return [4 /*yield*/, tfclient.contracts.get(deployment.contract_id)];
                    case 2:
                        contract = _c.sent();
                        node_id = contract["node_id"];
                        numberOfWorkloads = deployment.workloads.length;
                        deployment = deploymentFactory.fromObj(deployment);
                        _a = this._filterWorkloads(deployment, names, types), remainingWorkloads = _a[0], deletedMachineWorkloads = _a[1];
                        if (remainingWorkloads.length === 0) {
                            twinDeployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.delete, 0, 0));
                        }
                        return [4 /*yield*/, this._deleteMachineNetwork(deployment, remainingWorkloads, deletedMachineWorkloads, node_id)];
                    case 3:
                        _b = _c.sent(), newTwinDeployments = _b[0], newRemainingWorkloads = _b[1];
                        twinDeployments = twinDeployments.concat(newTwinDeployments);
                        remainingWorkloads = newRemainingWorkloads;
                        if (remainingWorkloads.length !== 0 && remainingWorkloads.length < numberOfWorkloads) {
                            deployment.workloads = remainingWorkloads;
                            twinDeployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.update, 0, 0));
                        }
                        return [2 /*return*/, twinDeployments];
                }
            });
        });
    };
    return HighLevelBase;
}());
exports.HighLevelBase = HighLevelBase;
