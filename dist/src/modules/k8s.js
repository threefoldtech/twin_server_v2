"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.k8s = void 0;
var grid3_client_1 = require("grid3_client");
var netaddr_1 = require("netaddr");
var models_1 = require("./models");
var base_1 = require("./base");
var index_1 = require("../helpers/index");
var twinDeploymentHandler_1 = require("../high_level/twinDeploymentHandler");
var models_2 = require("../high_level/models");
var kubernetes_1 = require("../high_level/kubernetes");
var network_1 = require("../primitives/network");
var deployment_1 = require("../primitives/deployment");
var K8s = /** @class */ (function (_super) {
    __extends(K8s, _super);
    function K8s() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fileName = "kubernetes.json";
        return _this;
    }
    K8s.prototype._getMastersWorkload = function (deployments) {
        var workloads = [];
        for (var _i = 0, deployments_1 = deployments; _i < deployments_1.length; _i++) {
            var deployment = deployments_1[_i];
            var d = deployment;
            if (deployment instanceof models_2.TwinDeployment) {
                d = deployment.deployment;
            }
            for (var _a = 0, _b = d.workloads; _a < _b.length; _a++) {
                var workload = _b[_a];
                if (workload.type === grid3_client_1.WorkloadTypes.zmachine && workload.data["env"]["K3S_URL"] === "") {
                    workloads.push(workload);
                }
            }
        }
        return workloads;
    };
    K8s.prototype._getMastersIp = function (deployments) {
        var ips = [];
        var workloads = this._getMastersWorkload(deployments);
        for (var _i = 0, workloads_1 = workloads; _i < workloads_1.length; _i++) {
            var workload = workloads_1[_i];
            ips.push(workload.data["network"]["interfaces"][0]["ip"]);
        }
        return ips;
    };
    K8s.prototype.deploy = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var network, deployments, wireguardConfig, kubernetes, _i, _a, master, _b, twinDeployments, wgConfig, masterIps, _c, _d, worker, _e, twinDeployments, _, twinDeploymentHandler, contracts;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (options.masters.length > 1) {
                            throw Error("Multi master is not supported");
                        }
                        if (this.exists(options.name)) {
                            throw Error("Another k8s deployment with the same name " + options.name + " is already exist");
                        }
                        network = new network_1.Network(options.network.name, options.network.ip_range);
                        return [4 /*yield*/, network.load(true)];
                    case 1:
                        _f.sent();
                        deployments = [];
                        wireguardConfig = "";
                        kubernetes = new kubernetes_1.Kubernetes();
                        _i = 0, _a = options.masters;
                        _f.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        master = _a[_i];
                        return [4 /*yield*/, kubernetes.add_master(master.name, master.node_id, options.secret, master.cpu, master.memory, master.disk_size, master.public_ip, network, options.ssh_key, options.metadata, options.description)];
                    case 3:
                        _b = _f.sent(), twinDeployments = _b[0], wgConfig = _b[1];
                        deployments = deployments.concat(twinDeployments);
                        if (wgConfig) {
                            wireguardConfig = wgConfig;
                        }
                        _f.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        masterIps = this._getMastersIp(deployments);
                        if (masterIps.length === 0) {
                            throw Error("Couldn't get master ip");
                        }
                        _c = 0, _d = options.workers;
                        _f.label = 6;
                    case 6:
                        if (!(_c < _d.length)) return [3 /*break*/, 9];
                        worker = _d[_c];
                        return [4 /*yield*/, kubernetes.add_worker(worker.name, worker.node_id, options.secret, masterIps[0], worker.cpu, worker.memory, worker.disk_size, worker.public_ip, network, options.ssh_key, options.metadata, options.description)];
                    case 7:
                        _e = _f.sent(), twinDeployments = _e[0], _ = _e[1];
                        deployments = deployments.concat(twinDeployments);
                        _f.label = 8;
                    case 8:
                        _c++;
                        return [3 /*break*/, 6];
                    case 9:
                        twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler();
                        return [4 /*yield*/, twinDeploymentHandler.handle(deployments)];
                    case 10:
                        contracts = _f.sent();
                        this.save(options.name, contracts, wireguardConfig);
                        return [2 /*return*/, { "contracts": contracts, "wireguard_config": wireguardConfig }];
                }
            });
        });
    };
    K8s.prototype.list = function () {
        return this._list();
    };
    K8s.prototype.get = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._get(options.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    K8s.prototype.delete = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._delete(options.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    K8s.prototype.update = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var deploymentObjs, _i, _a, workload, masterIps, networkName, network, twinDeployments, kubernetes, _b, _c, master, _d, TDeployments, _, _e, _f, worker, _g, TDeployments, _, deploymentFactory, twinDeploymentHandler, finalTwinDeployments, deploymentNodeIds, _h, deploymentObjs_1, deploymentObj, oldDeployment, node_id, deploymentFound, _j, twinDeployments_1, twinDeployment, tDeployments, contracts;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        if (!this.exists(options.name)) {
                            throw Error("There is no k8s deployment with name: " + options.name);
                        }
                        if (options.masters.length > 1) {
                            throw Error("Multi master is not supported");
                        }
                        return [4 /*yield*/, this._get(options.name)];
                    case 1:
                        deploymentObjs = _k.sent();
                        for (_i = 0, _a = deploymentObjs[0].workloads; _i < _a.length; _i++) {
                            workload = _a[_i];
                            if (workload.type !== grid3_client_1.WorkloadTypes.network) {
                                continue;
                            }
                            if (workload.name !== options.network.name) {
                                throw Error("Network name can't be changed");
                            }
                        }
                        masterIps = this._getMastersIp(deploymentObjs);
                        if (masterIps.length === 0) {
                            throw Error("Couldn't get master ip");
                        }
                        networkName = options.network.name;
                        network = new network_1.Network(networkName, options.network.ip_range);
                        return [4 /*yield*/, network.load(true)
                            //TODO: check that the master nodes are not changed
                        ];
                    case 2:
                        _k.sent();
                        twinDeployments = [];
                        kubernetes = new kubernetes_1.Kubernetes();
                        _b = 0, _c = options.masters;
                        _k.label = 3;
                    case 3:
                        if (!(_b < _c.length)) return [3 /*break*/, 6];
                        master = _c[_b];
                        return [4 /*yield*/, kubernetes.add_master(master.name, master.node_id, options.secret, master.cpu, master.memory, master.disk_size, master.public_ip, network, options.ssh_key, options.metadata, options.description)];
                    case 4:
                        _d = _k.sent(), TDeployments = _d[0], _ = _d[1];
                        twinDeployments = twinDeployments.concat(TDeployments);
                        _k.label = 5;
                    case 5:
                        _b++;
                        return [3 /*break*/, 3];
                    case 6:
                        _e = 0, _f = options.workers;
                        _k.label = 7;
                    case 7:
                        if (!(_e < _f.length)) return [3 /*break*/, 10];
                        worker = _f[_e];
                        return [4 /*yield*/, kubernetes.add_worker(worker.name, worker.node_id, options.secret, masterIps[0], worker.cpu, worker.memory, worker.disk_size, worker.public_ip, network, options.ssh_key, options.metadata, options.description)];
                    case 8:
                        _g = _k.sent(), TDeployments = _g[0], _ = _g[1];
                        twinDeployments = twinDeployments.concat(TDeployments);
                        _k.label = 9;
                    case 9:
                        _e++;
                        return [3 /*break*/, 7];
                    case 10:
                        deploymentFactory = new deployment_1.DeploymentFactory();
                        twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler();
                        finalTwinDeployments = [];
                        finalTwinDeployments = twinDeployments.filter(function (d) { return d.operation === models_2.Operations.update; });
                        twinDeployments = twinDeploymentHandler.deployMerge(twinDeployments);
                        deploymentNodeIds = this._getDeploymentNodeIds(options.name);
                        finalTwinDeployments = finalTwinDeployments.concat(twinDeployments.filter(function (d) { return !deploymentNodeIds.includes(d.nodeId); }));
                        _h = 0, deploymentObjs_1 = deploymentObjs;
                        _k.label = 11;
                    case 11:
                        if (!(_h < deploymentObjs_1.length)) return [3 /*break*/, 18];
                        deploymentObj = deploymentObjs_1[_h];
                        oldDeployment = deploymentFactory.fromObj(deploymentObj);
                        node_id = this._getNodeIdFromContractId(options.name, oldDeployment.contract_id);
                        deploymentFound = false;
                        _j = 0, twinDeployments_1 = twinDeployments;
                        _k.label = 12;
                    case 12:
                        if (!(_j < twinDeployments_1.length)) return [3 /*break*/, 15];
                        twinDeployment = twinDeployments_1[_j];
                        if (twinDeployment.nodeId !== node_id) {
                            return [3 /*break*/, 14];
                        }
                        return [4 /*yield*/, deploymentFactory.UpdateDeployment(oldDeployment, twinDeployment.deployment, network)];
                    case 13:
                        oldDeployment = _k.sent();
                        deploymentFound = true;
                        if (!oldDeployment) {
                            return [3 /*break*/, 14];
                        }
                        finalTwinDeployments.push(new models_2.TwinDeployment(oldDeployment, models_2.Operations.update, 0, 0));
                        return [3 /*break*/, 15];
                    case 14:
                        _j++;
                        return [3 /*break*/, 12];
                    case 15:
                        if (!!deploymentFound) return [3 /*break*/, 17];
                        return [4 /*yield*/, kubernetes.deleteNode(oldDeployment, [])];
                    case 16:
                        tDeployments = _k.sent();
                        finalTwinDeployments = finalTwinDeployments.concat(tDeployments);
                        _k.label = 17;
                    case 17:
                        _h++;
                        return [3 /*break*/, 11];
                    case 18: return [4 /*yield*/, twinDeploymentHandler.handle(finalTwinDeployments)];
                    case 19:
                        contracts = _k.sent();
                        if (contracts.created.length === 0 && contracts.updated.length === 0 && contracts.deleted.length === 0) {
                            return [2 /*return*/, "Nothing found to update"];
                        }
                        this.save(options.name, contracts);
                        return [2 /*return*/, { "contracts": contracts }];
                }
            });
        });
    };
    K8s.prototype.add_worker = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var deploymentObjs, kubernetes, masterWorkloads, masterWorkload, networkName, networkIpRange, network, _a, twinDeployments, _, finalTwinDeployments, twinDeployment, deploymentFactory, contract_id, _i, deploymentObjs_2, deploymentObj, oldDeployment, newDeployment, deployment, twinDeploymentHandler, contracts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.exists(options.deployment_name)) {
                            throw Error("There is no k8s deployment with name: " + options.deployment_name);
                        }
                        return [4 /*yield*/, this._get(options.deployment_name)];
                    case 1:
                        deploymentObjs = _b.sent();
                        kubernetes = new kubernetes_1.Kubernetes();
                        masterWorkloads = this._getMastersWorkload(deploymentObjs);
                        if (masterWorkloads.length === 0) {
                            throw Error("Couldn't get master node");
                        }
                        masterWorkload = masterWorkloads[0];
                        networkName = masterWorkload.data["network"].interfaces[0].network;
                        networkIpRange = netaddr_1.Addr(masterWorkload.data["network"].interfaces[0].ip).mask(16).toString();
                        network = new network_1.Network(networkName, networkIpRange);
                        return [4 /*yield*/, network.load(true)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, kubernetes.add_worker(options.name, options.node_id, masterWorkload.data["env"]["K3S_TOKEN"], masterWorkload.data["network"]["interfaces"][0]["ip"], options.cpu, options.memory, options.disk_size, options.public_ip, network, masterWorkload.data["env"]["SSH_KEY"], masterWorkload.metadata, masterWorkload.description)
                            // twindeployments can be 2 deployments if there is access node deployment done,
                            // but as there is a deployment already so the access node deployment already done
                            // then we need only the machine deployment.
                            // but it may have a network update
                        ];
                    case 3:
                        _a = _b.sent(), twinDeployments = _a[0], _ = _a[1];
                        finalTwinDeployments = twinDeployments.filter(function (d) { return d.operation === models_2.Operations.update; });
                        twinDeployment = twinDeployments.pop();
                        deploymentFactory = new deployment_1.DeploymentFactory();
                        contract_id = this._getContractIdFromNodeId(options.deployment_name, options.node_id);
                        if (!contract_id) return [3 /*break*/, 7];
                        _i = 0, deploymentObjs_2 = deploymentObjs;
                        _b.label = 4;
                    case 4:
                        if (!(_i < deploymentObjs_2.length)) return [3 /*break*/, 7];
                        deploymentObj = deploymentObjs_2[_i];
                        oldDeployment = deploymentFactory.fromObj(deploymentObj);
                        if (oldDeployment.contract_id !== contract_id) {
                            return [3 /*break*/, 6];
                        }
                        newDeployment = deploymentFactory.fromObj(deploymentObj);
                        newDeployment.workloads = newDeployment.workloads.concat(twinDeployment.deployment.workloads);
                        return [4 /*yield*/, deploymentFactory.UpdateDeployment(oldDeployment, newDeployment, network)];
                    case 5:
                        deployment = _b.sent();
                        twinDeployment.deployment = deployment;
                        twinDeployment.operation = models_2.Operations.update;
                        return [3 /*break*/, 7];
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        finalTwinDeployments.push(twinDeployment);
                        twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler();
                        return [4 /*yield*/, twinDeploymentHandler.handle(finalTwinDeployments)];
                    case 8:
                        contracts = _b.sent();
                        this.save(options.deployment_name, contracts);
                        return [2 /*return*/, { "contracts": contracts }];
                }
            });
        });
    };
    K8s.prototype.delete_worker = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var kubernetes, twinDeploymentHandler, deployments, _i, deployments_2, deployment, twinDeployments, contracts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.exists(options.deployment_name)) {
                            throw Error("There is no k8s deployment with name: " + options.deployment_name);
                        }
                        kubernetes = new kubernetes_1.Kubernetes();
                        twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler();
                        return [4 /*yield*/, this._get(options.deployment_name)];
                    case 1:
                        deployments = _a.sent();
                        _i = 0, deployments_2 = deployments;
                        _a.label = 2;
                    case 2:
                        if (!(_i < deployments_2.length)) return [3 /*break*/, 6];
                        deployment = deployments_2[_i];
                        return [4 /*yield*/, kubernetes.deleteNode(deployment, [options.name])];
                    case 3:
                        twinDeployments = _a.sent();
                        return [4 /*yield*/, twinDeploymentHandler.handle(twinDeployments)];
                    case 4:
                        contracts = _a.sent();
                        if (contracts["deleted"].length > 0 || contracts["updated"].length > 0) {
                            this.save(options.deployment_name, contracts);
                            return [2 /*return*/, contracts];
                        }
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: throw Error("Worker node with name " + options.name + " is not found");
                }
            });
        });
    };
    __decorate([
        index_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [models_1.K8S]),
        __metadata("design:returntype", Promise)
    ], K8s.prototype, "deploy", null);
    __decorate([
        index_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], K8s.prototype, "list", null);
    __decorate([
        index_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], K8s.prototype, "get", null);
    __decorate([
        index_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], K8s.prototype, "delete", null);
    __decorate([
        index_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [models_1.K8S]),
        __metadata("design:returntype", Promise)
    ], K8s.prototype, "update", null);
    __decorate([
        index_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [models_1.AddWorker]),
        __metadata("design:returntype", Promise)
    ], K8s.prototype, "add_worker", null);
    __decorate([
        index_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [models_1.DeleteWorker]),
        __metadata("design:returntype", Promise)
    ], K8s.prototype, "delete_worker", null);
    return K8s;
}(base_1.BaseModule));
exports.k8s = K8s;
