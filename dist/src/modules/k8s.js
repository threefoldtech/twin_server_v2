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
var models_1 = require("./models");
var base_1 = require("./base");
var index_1 = require("../helpers/index");
var twinDeploymentHandler_1 = require("../high_level/twinDeploymentHandler");
var kubernetes_1 = require("../high_level/kubernetes");
var network_1 = require("../primitives/network");
var ipRange = "10.200.0.0/16";
var K8s = /** @class */ (function (_super) {
    __extends(K8s, _super);
    function K8s() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fileName = "kubernetes.json";
        return _this;
    }
    K8s.prototype.deploy = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var networkName, network, deployments, wireguardConfig, kubernetes, _i, _a, master, _b, twinDeployments, wgConfig, masterIp, _c, deployments_1, twinDeployment, _d, _e, workload, _f, _g, worker, _h, twinDeployments, _, twinDeploymentHandler, contracts, data;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        if (options.masters.length > 1) {
                            throw Error("Multi master is not supported");
                        }
                        if (this.exists(options.name)) {
                            throw Error("Another k8s deployment with the same name " + options.name + " is already exist");
                        }
                        networkName = options.name + "_k8s_network";
                        network = new network_1.Network(networkName, ipRange);
                        return [4 /*yield*/, network.load(true)];
                    case 1:
                        _j.sent();
                        if (network.exists()) {
                            throw Error("A kubernetes cluster with same name " + options.name + " already exists");
                        }
                        deployments = [];
                        wireguardConfig = "";
                        kubernetes = new kubernetes_1.Kubernetes();
                        _i = 0, _a = options.masters;
                        _j.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        master = _a[_i];
                        return [4 /*yield*/, kubernetes.add_master(master.name, master.node_id, options.secret, master.cpu, master.memory, master.disk_size, master.public_ip, network, options.ssh_key, options.metadata, options.description)];
                    case 3:
                        _b = _j.sent(), twinDeployments = _b[0], wgConfig = _b[1];
                        deployments = deployments.concat(twinDeployments);
                        if (wgConfig) {
                            wireguardConfig = wgConfig;
                        }
                        _j.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        masterIp = "";
                        for (_c = 0, deployments_1 = deployments; _c < deployments_1.length; _c++) {
                            twinDeployment = deployments_1[_c];
                            for (_d = 0, _e = twinDeployment.deployment.workloads; _d < _e.length; _d++) {
                                workload = _e[_d];
                                if (workload.type === grid3_client_1.WorkloadTypes.zmachine) {
                                    masterIp = workload.data["network"]["interfaces"][0]["ip"];
                                    break;
                                }
                            }
                        }
                        _f = 0, _g = options.workers;
                        _j.label = 6;
                    case 6:
                        if (!(_f < _g.length)) return [3 /*break*/, 9];
                        worker = _g[_f];
                        return [4 /*yield*/, kubernetes.add_worker(worker.name, worker.node_id, options.secret, masterIp, worker.cpu, worker.memory, worker.disk_size, worker.public_ip, network, options.ssh_key, options.metadata, options.description)];
                    case 7:
                        _h = _j.sent(), twinDeployments = _h[0], _ = _h[1];
                        deployments = deployments.concat(twinDeployments);
                        _j.label = 8;
                    case 8:
                        _f++;
                        return [3 /*break*/, 6];
                    case 9:
                        twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler();
                        return [4 /*yield*/, twinDeploymentHandler.handle(deployments)];
                    case 10:
                        contracts = _j.sent();
                        data = this.save(options.name, contracts.created, wireguardConfig);
                        return [2 /*return*/, data];
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
    return K8s;
}(base_1.BaseModule));
exports.k8s = K8s;
