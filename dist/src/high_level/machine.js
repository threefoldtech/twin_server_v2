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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualMachine = void 0;
var models_1 = require("./models");
var index_1 = require("../primitives/index");
var utils_1 = require("../helpers/utils");
var VirtualMachine = /** @class */ (function () {
    function VirtualMachine() {
    }
    VirtualMachine.prototype.create = function (name, nodeId, flist, cpu, memory, disks, publicIP, network, entrypoint, env, metadata, description) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var deployments, workloads, diskMounts, _i, disks_1, d, dName, disk, ipName, publicIPs, ipv4, accessNodes, access_net_workload, wgConfig, filteredAccessNodes, _a, _b, accessNodeId, access_node_id, znet_workload, deploymentFactory, accessNodeId, _c, deployment_1, deploymentHash_1, vm, machine_ip, _d, deployment, deploymentHash;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        deployments = [];
                        workloads = [];
                        diskMounts = [];
                        for (_i = 0, disks_1 = disks; _i < disks_1.length; _i++) {
                            d = disks_1[_i];
                            dName = utils_1.generateString(10);
                            disk = new index_1.Disk();
                            workloads.push(disk.create(d["size"], dName, metadata, description));
                            diskMounts.push(disk.createMount(dName, d["mountpoint"]));
                        }
                        ipName = "";
                        publicIPs = 0;
                        if (publicIP) {
                            ipv4 = new index_1.IPv4();
                            ipName = utils_1.generateString(10);
                            workloads.push(ipv4.create(ipName, metadata, description));
                            publicIPs++;
                        }
                        return [4 /*yield*/, index_1.getAccessNodes()];
                    case 1:
                        accessNodes = _e.sent();
                        wgConfig = "";
                        if (!!Object.keys(accessNodes).includes(nodeId.toString())) return [3 /*break*/, 4];
                        filteredAccessNodes = [];
                        for (_a = 0, _b = Object.keys(accessNodes); _a < _b.length; _a++) {
                            accessNodeId = _b[_a];
                            if (accessNodes[accessNodeId]["ipv4"]) {
                                filteredAccessNodes.push(accessNodeId);
                            }
                        }
                        access_node_id = utils_1.randomChoice(filteredAccessNodes);
                        return [4 /*yield*/, network.addNode(access_node_id, metadata, description)];
                    case 2:
                        access_net_workload = _e.sent();
                        return [4 /*yield*/, network.addAccess(access_node_id, true)];
                    case 3:
                        wgConfig = _e.sent();
                        _e.label = 4;
                    case 4: return [4 /*yield*/, network.addNode(nodeId, metadata, description)];
                    case 5:
                        znet_workload = _e.sent();
                        if (!znet_workload) return [3 /*break*/, 8];
                        if (!!access_net_workload) return [3 /*break*/, 7];
                        return [4 /*yield*/, network.addAccess(nodeId, true)];
                    case 6:
                        wgConfig = _e.sent();
                        znet_workload["data"] = network.updateNetwork(znet_workload.data);
                        _e.label = 7;
                    case 7:
                        workloads.push(znet_workload);
                        return [3 /*break*/, 9];
                    case 8: throw Error("Network update is not implemented");
                    case 9:
                        deploymentFactory = new index_1.DeploymentFactory();
                        if (access_net_workload) {
                            accessNodeId = access_net_workload.data["node_id"];
                            access_net_workload["data"] = network.updateNetwork(access_net_workload.data);
                            _c = deploymentFactory.create([access_net_workload], 1626394539, metadata, description), deployment_1 = _c[0], deploymentHash_1 = _c[1];
                            deployments.push(new models_1.TwinDeployment(deployment_1, deploymentHash_1, models_1.Operations.deploy, 0, accessNodeId));
                        }
                        vm = new index_1.VM();
                        machine_ip = network.getFreeIP(nodeId);
                        workloads.push(vm.create(name, flist, cpu, memory, diskMounts, network.name, machine_ip, true, ipName, entrypoint, env, metadata, description));
                        _d = deploymentFactory.create(workloads, 1626394539, metadata, description), deployment = _d[0], deploymentHash = _d[1];
                        deployments.push(new models_1.TwinDeployment(deployment, deploymentHash, models_1.Operations.deploy, publicIPs, nodeId));
                        return [2 /*return*/, [deployments, wgConfig]];
                }
            });
        });
    };
    return VirtualMachine;
}());
exports.VirtualMachine = VirtualMachine;
