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
var Machine = /** @class */ (function () {
    function Machine() {
    }
    Machine.prototype.deploy = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var workloads, disks, i, d, dName, disk, ipName, publicIPs, ipv4, networkName, network, znet_workload, vm, vmName, deploymentFactory, _a, deployment, deploymentHash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
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
                        networkName = options.network_name;
                        network = new index_1.Network(networkName);
                        znet_workload = network.create(options.ip_range, options.ip, options.metadata, options.description);
                        if (znet_workload) {
                            workloads.push(znet_workload);
                        }
                        vm = new index_1.VM();
                        vmName = utils_1.generateString(10);
                        workloads.push(vm.create(vmName, options.flist, options.cpu, options.memory, disks, networkName, options.ip, true, ipName, options.entrypoint, options.env, options.metadata, options.description));
                        deploymentFactory = new index_1.DeploymentFactory();
                        _a = deploymentFactory.create(workloads, 1626394539, options.metadata, options.description), deployment = _a[0], deploymentHash = _a[1];
                        return [4 /*yield*/, utils_2.createContractAndSendToZos(deployment, options.node_id, options.node_twin_id, deploymentHash, publicIPs)];
                    case 1: return [2 /*return*/, _b.sent()];
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
