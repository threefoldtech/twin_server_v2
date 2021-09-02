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
exports.machine = void 0;
var index_1 = require("../primitives/index");
var expose_1 = require("../helpers/expose");
var utils_1 = require("../helpers/utils");
var utils_2 = require("./utils");
var nodes_1 = require("../primitives/nodes");
var Machine = /** @class */ (function () {
    function Machine() {
    }
    Machine.prototype.deploy = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var contracts, workloads, disks, i, d, dName, disk, ipName, publicIPs, ipv4, networkName, network, accessNodes, access_net_workload, wgConfig, filteredAccessNodes, _i, _a, accessNodeId, node_id, znet_workload, deploymentFactory, accessNodeId, _b, deployment_1, deploymentHash_1, net_contract, vm, vmName, machine_ip, _c, deployment, deploymentHash, machine_contract;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        contracts = [];
                        workloads = [];
                        disks = [];
                        for (i = 0; i < options.disks.length; i++) {
                            d = options.disks[i];
                            dName = utils_1.generateString(10);
                            disk = new index_1.Disk();
                            workloads.push(disk.create(d.size, dName, options.metadata, options.description));
                            disks.push(disk.createMount(dName, d.mountpoint));
                        }
                        ipName = "";
                        publicIPs = 0;
                        if (options.public_ip) {
                            ipv4 = new index_1.IPv4();
                            ipName = utils_1.generateString(10);
                            workloads.push(ipv4.create(ipName, options.metadata, options.description));
                            publicIPs++;
                        }
                        networkName = options.network.name;
                        network = new index_1.Network(networkName, options.network.ip_range);
                        return [4 /*yield*/, network.load(true)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, nodes_1.getAccessNodes()];
                    case 2:
                        accessNodes = _d.sent();
                        wgConfig = "";
                        if (!!Object.keys(accessNodes).includes(options.node_id.toString())) return [3 /*break*/, 5];
                        filteredAccessNodes = [];
                        for (_i = 0, _a = Object.keys(accessNodes); _i < _a.length; _i++) {
                            accessNodeId = _a[_i];
                            if (accessNodes[accessNodeId]["ipv4"]) {
                                filteredAccessNodes.push(accessNodeId);
                            }
                        }
                        node_id = utils_1.randomChoice(filteredAccessNodes);
                        return [4 /*yield*/, network.addNode(node_id, options.metadata, options.description)];
                    case 3:
                        access_net_workload = _d.sent();
                        return [4 /*yield*/, network.addAccess(node_id, true)];
                    case 4:
                        wgConfig = _d.sent();
                        _d.label = 5;
                    case 5: return [4 /*yield*/, network.addNode(options.node_id, options.metadata, options.description)];
                    case 6:
                        znet_workload = _d.sent();
                        if (!znet_workload) return [3 /*break*/, 9];
                        if (!!access_net_workload) return [3 /*break*/, 8];
                        return [4 /*yield*/, network.addAccess(options.node_id, true)];
                    case 7:
                        wgConfig = _d.sent();
                        znet_workload["data"] = network.updateNetwork(znet_workload.data);
                        _d.label = 8;
                    case 8:
                        workloads.push(znet_workload);
                        return [3 /*break*/, 10];
                    case 9: throw Error("Network workload is not generated");
                    case 10:
                        deploymentFactory = new index_1.DeploymentFactory();
                        if (!access_net_workload) return [3 /*break*/, 13];
                        accessNodeId = access_net_workload.data["node_id"];
                        access_net_workload["data"] = network.updateNetwork(access_net_workload.data);
                        _b = deploymentFactory.create([access_net_workload], 1626394539, options.metadata, options.description), deployment_1 = _b[0], deploymentHash_1 = _b[1];
                        return [4 /*yield*/, utils_2.createContractAndSendToZos(deployment_1, accessNodeId, deploymentHash_1, 0)];
                    case 11:
                        net_contract = _d.sent();
                        return [4 /*yield*/, network.save(net_contract["contract_id"], [], accessNodeId)];
                    case 12:
                        _d.sent();
                        contracts.push(net_contract);
                        _d.label = 13;
                    case 13:
                        vm = new index_1.VM();
                        vmName = utils_1.generateString(10);
                        machine_ip = network.getFreeIP(options.node_id);
                        workloads.push(vm.create(vmName, options.flist, options.cpu, options.memory, disks, networkName, machine_ip, true, ipName, options.entrypoint, options.env, options.metadata, options.description));
                        _c = deploymentFactory.create(workloads, 1626394539, options.metadata, options.description), deployment = _c[0], deploymentHash = _c[1];
                        return [4 /*yield*/, utils_2.createContractAndSendToZos(deployment, options.node_id, deploymentHash, publicIPs)];
                    case 14:
                        machine_contract = _d.sent();
                        contracts.push(machine_contract);
                        return [4 /*yield*/, network.save(machine_contract["contract_id"], [machine_ip], options.node_id)];
                    case 15:
                        _d.sent();
                        return [2 /*return*/, { "contracts": contracts, "wireguard_config": wgConfig }];
                }
            });
        });
    };
    __decorate([
        expose_1.expose
    ], Machine.prototype, "deploy", null);
    return Machine;
}());
exports.machine = Machine;
