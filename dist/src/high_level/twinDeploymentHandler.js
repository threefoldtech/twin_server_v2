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
exports.TwinDeploymentHandler = void 0;
var grid3_client_1 = require("grid3_client");
var models_1 = require("./models");
var index_1 = require("../primitives/index");
var config_json_1 = __importDefault(require("../../config.json"));
var TwinDeploymentHandler = /** @class */ (function () {
    function TwinDeploymentHandler() {
        this.tfclient = new grid3_client_1.TFClient(config_json_1.default.url, config_json_1.default.mnemonic);
        this.rmb = new grid3_client_1.MessageBusClient();
    }
    TwinDeploymentHandler.prototype.deploy = function (deployment, node_id, publicIps) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, payload, node_twin_id, msg, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tfclient.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.tfclient.contracts.create(node_id, deployment.challenge_hash(), "", publicIps)];
                    case 2:
                        contract = _a.sent();
                        if (contract instanceof (Error)) {
                            throw Error("Failed to create contract " + contract);
                        }
                        console.log(contract);
                        deployment.contract_id = contract["contract_id"];
                        payload = JSON.stringify(deployment);
                        return [4 /*yield*/, index_1.getNodeTwinId(node_id)];
                    case 3:
                        node_twin_id = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, 8, 9]);
                        msg = this.rmb.prepare("zos.deployment.deploy", [node_twin_id], 0, 2);
                        this.rmb.send(msg, payload);
                        return [4 /*yield*/, this.rmb.read(msg)];
                    case 5:
                        result = _a.sent();
                        if (result[0].err) {
                            throw Error(result[0].err);
                        }
                        return [3 /*break*/, 9];
                    case 6:
                        err_1 = _a.sent();
                        return [4 /*yield*/, this.tfclient.contracts.cancel(contract["contract_id"])];
                    case 7:
                        _a.sent();
                        throw Error(err_1);
                    case 8:
                        this.tfclient.disconnect();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, contract];
                }
            });
        });
    };
    TwinDeploymentHandler.prototype.update = function (deployment, publicIps) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, payload, node_twin_id, msg, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // TODO: update the contract with public when it is available 
                    return [4 /*yield*/, this.tfclient.connect()];
                    case 1:
                        // TODO: update the contract with public when it is available 
                        _a.sent();
                        return [4 /*yield*/, this.tfclient.contracts.update(deployment.contract_id, "", deployment.challenge_hash())];
                    case 2:
                        contract = _a.sent();
                        if (contract instanceof (Error)) {
                            throw Error("Failed to update contract " + contract);
                        }
                        console.log(contract);
                        payload = JSON.stringify(deployment);
                        return [4 /*yield*/, index_1.getNodeTwinId(contract["node_id"])];
                    case 3:
                        node_twin_id = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, 7, 8]);
                        msg = this.rmb.prepare("zos.deployment.update", [node_twin_id], 0, 2);
                        this.rmb.send(msg, payload);
                        return [4 /*yield*/, this.rmb.read(msg)];
                    case 5:
                        result = _a.sent();
                        if (result[0].err) {
                            throw Error(result[0].err);
                        }
                        return [3 /*break*/, 8];
                    case 6:
                        err_2 = _a.sent();
                        throw Error(err_2);
                    case 7:
                        this.tfclient.disconnect();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, contract];
                }
            });
        });
    };
    TwinDeploymentHandler.prototype.delete = function (contract_id) {
        return __awaiter(this, void 0, void 0, function () {
            var tfclient, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tfclient = new grid3_client_1.TFClient(config_json_1.default.url, config_json_1.default.mnemonic);
                        return [4 /*yield*/, tfclient.connect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 6]);
                        return [4 /*yield*/, tfclient.contracts.cancel(contract_id)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        err_3 = _a.sent();
                        throw Error("Failed to cancel contract " + contract_id + " due to: " + err_3);
                    case 5:
                        tfclient.disconnect();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/, contract_id];
                }
            });
        });
    };
    TwinDeploymentHandler.prototype.getDeployment = function (contract_id) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, node_twin_id, msg, payload, result, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tfclient.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.tfclient.contracts.get(contract_id)];
                    case 2:
                        contract = _a.sent();
                        return [4 /*yield*/, index_1.getNodeTwinId(contract["node_id"])];
                    case 3:
                        node_twin_id = _a.sent();
                        msg = this.rmb.prepare("zos.deployment.get", [node_twin_id], 0, 2);
                        payload = { "contract_id": contract_id };
                        this.rmb.send(msg, JSON.stringify(payload));
                        return [4 /*yield*/, this.rmb.read(msg)];
                    case 4:
                        result = _a.sent();
                        if (result[0].err) {
                            console.error("Could not get deployment " + contract_id + " due to error: " + result[0].err + " ");
                        }
                        res = JSON.parse(result[0].dat);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    TwinDeploymentHandler.prototype.checkWorkload = function (workload, targetWorkload) {
        var state = false;
        if (workload.result.state === "error") {
            throw Error("Failed to deploy " + workload.type + " with name " + workload.name + " due to: " + workload.result.message);
        }
        else if (workload.result.state === "ok") {
            state = true;
        }
        if (workload.version === targetWorkload.version) {
            return state;
        }
        return false;
    };
    TwinDeploymentHandler.prototype.waitForDeployment = function (twinDeployment, timeout) {
        if (timeout === void 0) { timeout = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var now, deployment, readyWorkloads, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date().getTime();
                        _a.label = 1;
                    case 1:
                        if (!(new Date().getTime() < now + timeout * 1000 * 60)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getDeployment(twinDeployment.deployment.contract_id)];
                    case 2:
                        deployment = _a.sent();
                        if (!(deployment.workloads.length !== twinDeployment.deployment.workloads.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (f) { return setTimeout(f, 1000); })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 4:
                        readyWorkloads = 0;
                        for (i = 0; i < deployment.workloads.length; i++) {
                            if (this.checkWorkload(deployment.workloads[i], twinDeployment.deployment.workloads[i])) {
                                readyWorkloads += 1;
                            }
                        }
                        if (readyWorkloads === twinDeployment.deployment.workloads.length) {
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, new Promise(function (f) { return setTimeout(f, 1000); })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TwinDeploymentHandler.prototype.waitForDeployments = function (twinDeployments, timeout) {
        if (timeout === void 0) { timeout = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, _i, twinDeployments_1, twinDeployment, _a, promises_1, promise;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        promises = [];
                        for (_i = 0, twinDeployments_1 = twinDeployments; _i < twinDeployments_1.length; _i++) {
                            twinDeployment = twinDeployments_1[_i];
                            if ([models_1.Operations.deploy, models_1.Operations.update].includes(twinDeployment.operation)) {
                                promises.push(this.waitForDeployment(twinDeployment, timeout));
                            }
                        }
                        _a = 0, promises_1 = promises;
                        _b.label = 1;
                    case 1:
                        if (!(_a < promises_1.length)) return [3 /*break*/, 4];
                        promise = promises_1[_a];
                        return [4 /*yield*/, promise];
                    case 2:
                        if (!(_b.sent())) {
                            return [2 /*return*/, false];
                        }
                        _b.label = 3;
                    case 3:
                        _a++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    TwinDeploymentHandler.prototype.deployMerge = function (twinDeployments) {
        var deploymentMap = {};
        for (var _i = 0, twinDeployments_2 = twinDeployments; _i < twinDeployments_2.length; _i++) {
            var twinDeployment = twinDeployments_2[_i];
            if (twinDeployment.operation !== models_1.Operations.deploy) {
                continue;
            }
            if (Object.keys(deploymentMap).includes(twinDeployment.nodeId.toString())) {
                deploymentMap[twinDeployment.nodeId].deployment.workloads = deploymentMap[twinDeployment.nodeId].deployment.workloads.concat(twinDeployment.deployment.workloads);
                deploymentMap[twinDeployment.nodeId].publicIps += twinDeployment.publicIps;
            }
            else {
                deploymentMap[twinDeployment.nodeId] = twinDeployment;
            }
        }
        var deployments = [];
        for (var _a = 0, _b = Object.keys(deploymentMap); _a < _b.length; _a++) {
            var key = _b[_a];
            deployments.push(deploymentMap[key]);
        }
        return deployments;
    };
    TwinDeploymentHandler.prototype._updateToLatest = function (twinDeployments) {
        // all deployment pass should be with the same contract id to merge them to one deployment with all updates
        if (twinDeployments.length === 0) {
            return;
        }
        else if (twinDeployments.length === 1) {
            twinDeployments[0].deployment.version += 1;
            return twinDeployments[0];
        }
        var workloadMap = {};
        var publicIps = 0;
        var network = null;
        for (var _i = 0, twinDeployments_3 = twinDeployments; _i < twinDeployments_3.length; _i++) {
            var twinDeployment = twinDeployments_3[_i];
            for (var _a = 0, _b = twinDeployment.deployment.workloads; _a < _b.length; _a++) {
                var workload = _b[_a];
                if (workloadMap.hasOwnProperty(workload.name)) {
                    workloadMap[workload.name].push(workload);
                }
                else {
                    workloadMap[workload.name] = [workload];
                }
            }
            publicIps += twinDeployment.publicIps;
            if (!network && twinDeployment.network) {
                network = twinDeployment.network;
            }
        }
        var workloads = [];
        for (var _c = 0, _d = Object.keys(workloadMap); _c < _d.length; _c++) {
            var name_1 = _d[_c];
            var w = workloadMap[name_1][0];
            if (workloadMap[name_1].length < twinDeployments.length && w.version <= twinDeployments[0].deployment.version) {
                continue;
            }
            for (var _e = 0, _f = workloadMap[name_1]; _e < _f.length; _e++) {
                var workload = _f[_e];
                if (w.version < workload.version) {
                    w = workload;
                }
            }
            workloads.push(w);
        }
        var d = twinDeployments[0];
        d.deployment.workloads = workloads;
        d.publicIps = publicIps;
        d.network = network;
        d.deployment.version += 1;
        return d;
    };
    TwinDeploymentHandler.prototype.updateMerge = function (twinDeployments) {
        var deploymentMap = {};
        for (var _i = 0, twinDeployments_4 = twinDeployments; _i < twinDeployments_4.length; _i++) {
            var twinDeployment = twinDeployments_4[_i];
            if (twinDeployment.operation !== models_1.Operations.update) {
                continue;
            }
            if (deploymentMap.hasOwnProperty(twinDeployment.deployment.contract_id)) {
                deploymentMap[twinDeployment.deployment.contract_id].push(twinDeployment);
            }
            else {
                deploymentMap[twinDeployment.deployment.contract_id] = [twinDeployment];
            }
        }
        var deployments = [];
        for (var _a = 0, _b = Object.keys(deploymentMap); _a < _b.length; _a++) {
            var key = _b[_a];
            deployments.push(this._updateToLatest(deploymentMap[key]));
        }
        return deployments;
    };
    TwinDeploymentHandler.prototype.merge = function (twinDeployments) {
        var deployments = [];
        deployments = deployments.concat(this.deployMerge(twinDeployments));
        var deletedDeployments = twinDeployments.filter(function (d) { return d.operation === models_1.Operations.delete; });
        var deletedContracts = [];
        for (var _i = 0, deletedDeployments_1 = deletedDeployments; _i < deletedDeployments_1.length; _i++) {
            var d = deletedDeployments_1[_i];
            deletedContracts.push(d.deployment.contract_id);
        }
        var updatedDeployment = this.updateMerge(twinDeployments);
        deployments = deployments.concat(updatedDeployment.filter(function (d) { return !deletedContracts.includes(d.deployment.contract_id); }));
        deployments = deployments.concat(deletedDeployments);
        return deployments;
    };
    TwinDeploymentHandler.prototype.handle = function (twinDeployments) {
        return __awaiter(this, void 0, void 0, function () {
            var contracts, _i, twinDeployments_5, twinDeployment, _a, _b, workload, contract, contract, contract;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        twinDeployments = this.merge(twinDeployments);
                        contracts = { "created": [], "updated": [], "deleted": [] };
                        _i = 0, twinDeployments_5 = twinDeployments;
                        _c.label = 1;
                    case 1:
                        if (!(_i < twinDeployments_5.length)) return [3 /*break*/, 13];
                        twinDeployment = twinDeployments_5[_i];
                        for (_a = 0, _b = twinDeployment.deployment.workloads; _a < _b.length; _a++) {
                            workload = _b[_a];
                            if (!twinDeployment.network) {
                                break;
                            }
                            if (workload.type === grid3_client_1.WorkloadTypes.network) {
                                workload["data"] = twinDeployment.network.updateNetwork(workload.data);
                            }
                        }
                        if (!(twinDeployment.operation === models_1.Operations.deploy)) return [3 /*break*/, 5];
                        twinDeployment.deployment.sign(config_json_1.default.twin_id, config_json_1.default.mnemonic);
                        return [4 /*yield*/, this.deploy(twinDeployment.deployment, twinDeployment.nodeId, twinDeployment.publicIps)];
                    case 2:
                        contract = _c.sent();
                        twinDeployment.deployment.contract_id = contract["contract_id"];
                        contracts.created.push(contract);
                        if (!twinDeployment.network) return [3 /*break*/, 4];
                        return [4 /*yield*/, twinDeployment.network.save(contract["contract_id"], contract["node_id"])];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [3 /*break*/, 12];
                    case 5:
                        if (!(twinDeployment.operation === models_1.Operations.update)) return [3 /*break*/, 9];
                        twinDeployment.deployment.sign(config_json_1.default.twin_id, config_json_1.default.mnemonic);
                        return [4 /*yield*/, this.update(twinDeployment.deployment, twinDeployment.publicIps)];
                    case 6:
                        contract = _c.sent();
                        contracts.updated.push(contract);
                        if (!twinDeployment.network) return [3 /*break*/, 8];
                        return [4 /*yield*/, twinDeployment.network.save(contract["contract_id"], contract["node_id"])];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8: return [3 /*break*/, 12];
                    case 9:
                        if (!(twinDeployment.operation === models_1.Operations.delete)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.delete(twinDeployment.deployment.contract_id)];
                    case 10:
                        contract = _c.sent();
                        contracts.deleted.push({ "contract_id": contract });
                        if (!twinDeployment.network) return [3 /*break*/, 12];
                        return [4 /*yield*/, twinDeployment.network.save()];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 1];
                    case 13: return [4 /*yield*/, this.waitForDeployments(twinDeployments)];
                    case 14:
                        _c.sent();
                        return [2 /*return*/, contracts];
                }
            });
        });
    };
    return TwinDeploymentHandler;
}());
exports.TwinDeploymentHandler = TwinDeploymentHandler;
