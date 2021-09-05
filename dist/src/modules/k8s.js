"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var index_1 = require("../helpers/index");
var deploymentFactory_1 = require("../high_level/deploymentFactory");
var kubernetes_1 = require("../high_level/kubernetes");
var network_1 = require("../primitives/network");
var nodes_1 = require("../primitives/nodes");
var ipRange = "10.200.0.0/16";
var K8s = /** @class */ (function () {
    function K8s() {
    }
    K8s.prototype.deploy = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var networkName, network, masterNodeId, accessNodes, _i, _a, accessNode, workerNodeIds, deployments, kubernetes, _b, twinDeployments, wgConfig, masterIp, _c, twinDeployments_1, twinDeployment, _d, _e, workload, i, _f, twinDeployments_2, _, deploymentFactory, contracts;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (options.node_ids.length < options.workers + 1) {
                            throw Error("Number of nodes specified less than the required number for deploying 1 master and " + options.workers + " workers");
                        }
                        networkName = options.name + "_k8s_network";
                        network = new network_1.Network(networkName, ipRange);
                        return [4 /*yield*/, network.load(true)];
                    case 1:
                        _g.sent();
                        if (network.exists()) {
                            throw Error("A kubernetes cluster with same name " + options.name + " already exists");
                        }
                        masterNodeId = 0;
                        return [4 /*yield*/, nodes_1.getAccessNodes()];
                    case 2:
                        accessNodes = _g.sent();
                        for (_i = 0, _a = Object.keys(accessNodes); _i < _a.length; _i++) {
                            accessNode = _a[_i];
                            if (options.node_ids.includes(Number(accessNode))) {
                                masterNodeId = Number(accessNode);
                                break;
                            }
                        }
                        if (!masterNodeId) {
                            masterNodeId = options.node_ids.pop();
                        }
                        workerNodeIds = options.node_ids.filter(function (id) { return id !== masterNodeId; });
                        deployments = [];
                        kubernetes = new kubernetes_1.Kubernetes();
                        return [4 /*yield*/, kubernetes.add_master(masterNodeId, options.secret, options.cpu, options.memory, options.disk_size, options.public_ip, network, options.ssh_key, options.metadata, options.description)];
                    case 3:
                        _b = _g.sent(), twinDeployments = _b[0], wgConfig = _b[1];
                        masterIp = "";
                        for (_c = 0, twinDeployments_1 = twinDeployments; _c < twinDeployments_1.length; _c++) {
                            twinDeployment = twinDeployments_1[_c];
                            for (_d = 0, _e = twinDeployment.deployment.workloads; _d < _e.length; _d++) {
                                workload = _e[_d];
                                if (workload.type === grid3_client_1.WorkloadTypes.zmachine) {
                                    masterIp = workload.data["network"]["interfaces"][0]["ip"];
                                    break;
                                }
                            }
                        }
                        deployments = twinDeployments;
                        i = 0;
                        _g.label = 4;
                    case 4:
                        if (!(i < options.workers)) return [3 /*break*/, 7];
                        return [4 /*yield*/, kubernetes.add_worker(workerNodeIds[i], options.secret, masterIp, options.cpu, options.memory, options.disk_size, false, network, options.ssh_key, options.metadata, options.description)];
                    case 5:
                        _f = _g.sent(), twinDeployments_2 = _f[0], _ = _f[1];
                        deployments = deployments.concat(twinDeployments_2);
                        _g.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 4];
                    case 7:
                        deploymentFactory = new deploymentFactory_1.DeploymentFactory();
                        return [4 /*yield*/, deploymentFactory.handle(deployments, network)];
                    case 8:
                        contracts = _g.sent();
                        return [2 /*return*/, { "contracts": contracts, "wireguard_config": wgConfig }];
                }
            });
        });
    };
    __decorate([
        index_1.expose
    ], K8s.prototype, "deploy", null);
    return K8s;
}());
exports.k8s = K8s;
