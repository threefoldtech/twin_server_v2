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
exports.VirtualMachine = void 0;
var netaddr_1 = require("netaddr");
var grid3_client_1 = require("grid3_client");
var models_1 = require("./models");
var base_1 = require("./base");
var index_1 = require("../primitives/index");
var utils_1 = require("../helpers/utils");
var VirtualMachine = /** @class */ (function (_super) {
    __extends(VirtualMachine, _super);
    function VirtualMachine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VirtualMachine.prototype.create = function (name, nodeId, flist, cpu, memory, disks, publicIp, network, entrypoint, env, metadata, description) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var deployments, workloads, diskMounts, _i, disks_1, d, disk, ipName, publicIps, ipv4, deploymentFactory, accessNodes, access_net_workload, wgConfig, hasAccessNode, _a, _b, accessNode, filteredAccessNodes, _c, _d, accessNodeId, access_node_id, znet_workload, _e, _f, deployment_1, d, _g, _h, workload, accessNodeId, deployment_2, vm, machine_ip, deployment;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        deployments = [];
                        workloads = [];
                        diskMounts = [];
                        for (_i = 0, disks_1 = disks; _i < disks_1.length; _i++) {
                            d = disks_1[_i];
                            disk = new index_1.Disk();
                            workloads.push(disk.create(d["size"], d["name"], metadata, description));
                            diskMounts.push(disk.createMount(d["name"], d["mountpoint"]));
                        }
                        ipName = "";
                        publicIps = 0;
                        if (publicIp) {
                            ipv4 = new index_1.IPv4();
                            ipName = name + "_pubip";
                            workloads.push(ipv4.create(ipName, metadata, description));
                            publicIps++;
                        }
                        deploymentFactory = new index_1.DeploymentFactory();
                        return [4 /*yield*/, index_1.getAccessNodes()];
                    case 1:
                        accessNodes = _j.sent();
                        wgConfig = "";
                        hasAccessNode = false;
                        for (_a = 0, _b = Object.keys(accessNodes); _a < _b.length; _a++) {
                            accessNode = _b[_a];
                            if (network.nodeExists(Number(accessNode))) {
                                hasAccessNode = true;
                                break;
                            }
                        }
                        if (!(!Object.keys(accessNodes).includes(nodeId.toString()) && !hasAccessNode)) return [3 /*break*/, 4];
                        filteredAccessNodes = [];
                        for (_c = 0, _d = Object.keys(accessNodes); _c < _d.length; _c++) {
                            accessNodeId = _d[_c];
                            if (accessNodes[accessNodeId]["ipv4"]) {
                                filteredAccessNodes.push(accessNodeId);
                            }
                        }
                        access_node_id = Number(utils_1.randomChoice(filteredAccessNodes));
                        return [4 /*yield*/, network.addNode(access_node_id, metadata, description)];
                    case 2:
                        access_net_workload = _j.sent();
                        return [4 /*yield*/, network.addAccess(access_node_id, true)];
                    case 3:
                        wgConfig = _j.sent();
                        _j.label = 4;
                    case 4: return [4 /*yield*/, network.addNode(nodeId, metadata, description)];
                    case 5:
                        znet_workload = _j.sent();
                        if (!(znet_workload && network.exists())) return [3 /*break*/, 6];
                        // update network
                        for (_e = 0, _f = network.deployments; _e < _f.length; _e++) {
                            deployment_1 = _f[_e];
                            d = deploymentFactory.fromObj(deployment_1);
                            for (_g = 0, _h = d["workloads"]; _g < _h.length; _g++) {
                                workload = _h[_g];
                                if (workload["type"] !== grid3_client_1.WorkloadTypes.network || !netaddr_1.Addr(network.ipRange).contains(netaddr_1.Addr(workload["data"]["subnet"]))) {
                                    continue;
                                }
                                workload.data = network.updateNetwork(workload["data"]);
                                workload.version += 1;
                                break;
                            }
                            deployments.push(new models_1.TwinDeployment(d, models_1.Operations.update, 0, 0, network));
                        }
                        workloads.push(znet_workload);
                        return [3 /*break*/, 9];
                    case 6:
                        if (!znet_workload) return [3 /*break*/, 9];
                        if (!(!access_net_workload && !hasAccessNode)) return [3 /*break*/, 8];
                        return [4 /*yield*/, network.addAccess(nodeId, true)];
                    case 7:
                        // this node is access node, so add access point on it
                        wgConfig = _j.sent();
                        znet_workload["data"] = network.updateNetwork(znet_workload.data);
                        _j.label = 8;
                    case 8:
                        workloads.push(znet_workload);
                        _j.label = 9;
                    case 9:
                        if (access_net_workload) {
                            accessNodeId = access_net_workload.data["node_id"];
                            access_net_workload["data"] = network.updateNetwork(access_net_workload.data);
                            deployment_2 = deploymentFactory.create([access_net_workload], 1626394539, metadata, description);
                            deployments.push(new models_1.TwinDeployment(deployment_2, models_1.Operations.deploy, 0, accessNodeId, network));
                        }
                        vm = new index_1.VM();
                        machine_ip = network.getFreeIP(nodeId);
                        workloads.push(vm.create(name, flist, cpu, memory, diskMounts, network.name, machine_ip, true, ipName, entrypoint, env, metadata, description));
                        deployment = deploymentFactory.create(workloads, 1626394539, metadata, description);
                        deployments.push(new models_1.TwinDeployment(deployment, models_1.Operations.deploy, publicIps, nodeId, network));
                        return [2 /*return*/, [deployments, wgConfig]];
                }
            });
        });
    };
    VirtualMachine.prototype.update = function (oldDeployment, name, nodeId, flist, cpu, memory, disks, publicIp, network, entrypoint, env, metadata, description) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var vm, _a, twinDeployments, _, deploymentFactory, updatedDeployment;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        vm = new VirtualMachine();
                        return [4 /*yield*/, vm.create(name, nodeId, flist, cpu, memory, disks, publicIp, network, entrypoint, env, metadata, description)];
                    case 1:
                        _a = _b.sent(), twinDeployments = _a[0], _ = _a[1];
                        deploymentFactory = new index_1.DeploymentFactory();
                        return [4 /*yield*/, deploymentFactory.UpdateDeployment(oldDeployment, twinDeployments.pop().deployment, network)];
                    case 2:
                        updatedDeployment = _b.sent();
                        if (!updatedDeployment) {
                            throw Error("Nothing found to be updated");
                        }
                        return [2 /*return*/, new models_1.TwinDeployment(updatedDeployment, models_1.Operations.update, 0, 0, network)];
                }
            });
        });
    };
    VirtualMachine.prototype.delete = function (deployment, names) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._delete(deployment, names, [grid3_client_1.WorkloadTypes.ipv4, grid3_client_1.WorkloadTypes.zmount, grid3_client_1.WorkloadTypes.zmachine])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return VirtualMachine;
}(base_1.HighLevelBase));
exports.VirtualMachine = VirtualMachine;
