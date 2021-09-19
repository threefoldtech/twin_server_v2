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
exports.zdbs = void 0;
var base_1 = require("./base");
var models_1 = require("./models");
var zdb_1 = require("../high_level/zdb");
var expose_1 = require("../helpers/expose");
var deployment_1 = require("../primitives/deployment");
var models_2 = require("../high_level/models");
var twinDeploymentHandler_1 = require("../high_level/twinDeploymentHandler");
var Zdbs = /** @class */ (function (_super) {
    __extends(Zdbs, _super);
    function Zdbs() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fileName = "zdbs.json";
        return _this;
    }
    Zdbs.prototype.deploy = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var zdbFactory, twinDeployments, _i, _a, instance, twinDeployment, twinDeploymentHandler, contracts;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.exists(options.name)) {
                            throw Error("Another zdb deployment with the same name " + options.name + " is already exist");
                        }
                        zdbFactory = new zdb_1.Zdb();
                        twinDeployments = [];
                        for (_i = 0, _a = options.zdbs; _i < _a.length; _i++) {
                            instance = _a[_i];
                            twinDeployment = zdbFactory.create(instance.name, instance.node_id, instance.namespace, instance.disk_size, instance.disk_type, instance.mode, instance.password, instance.public, options.metadata, options.description);
                            twinDeployments.push(twinDeployment);
                        }
                        twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler();
                        return [4 /*yield*/, twinDeploymentHandler.handle(twinDeployments)];
                    case 1:
                        contracts = _b.sent();
                        this.save(options.name, contracts);
                        return [2 /*return*/, { "contracts": contracts }];
                }
            });
        });
    };
    Zdbs.prototype.list = function () {
        return this._list();
    };
    Zdbs.prototype.get = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._get(options.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Zdbs.prototype.delete = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._delete(options.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Zdbs.prototype.update = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var deploymentFactory, zdbFactory, twinDeployments, _i, _a, instance, twinDeployment, finalTwinDeployments, twinDeploymentHandler, deploymentNodeIds, deploymentObjs, _b, deploymentObjs_1, deploymentObj, oldDeployment, node_id, deploymentFound, _c, twinDeployments_1, twinDeployment, contracts;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.exists(options.name)) {
                            throw Error("There is no zdb deployment with name: " + options.name);
                        }
                        deploymentFactory = new deployment_1.DeploymentFactory();
                        zdbFactory = new zdb_1.Zdb();
                        twinDeployments = [];
                        for (_i = 0, _a = options.zdbs; _i < _a.length; _i++) {
                            instance = _a[_i];
                            twinDeployment = zdbFactory.create(instance.name, instance.node_id, instance.namespace, instance.disk_size, instance.disk_type, instance.mode, instance.password, instance.public, options.metadata, options.description);
                            twinDeployments.push(twinDeployment);
                        }
                        finalTwinDeployments = [];
                        twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler();
                        twinDeployments = twinDeploymentHandler.deployMerge(twinDeployments);
                        deploymentNodeIds = this._getDeploymentNodeIds(options.name);
                        finalTwinDeployments = twinDeployments.filter(function (d) { return !deploymentNodeIds.includes(d.nodeId); });
                        return [4 /*yield*/, this._get(options.name)];
                    case 1:
                        deploymentObjs = _d.sent();
                        _b = 0, deploymentObjs_1 = deploymentObjs;
                        _d.label = 2;
                    case 2:
                        if (!(_b < deploymentObjs_1.length)) return [3 /*break*/, 8];
                        deploymentObj = deploymentObjs_1[_b];
                        oldDeployment = deploymentFactory.fromObj(deploymentObj);
                        node_id = this._getNodeIdFromContractId(options.name, oldDeployment.contract_id);
                        deploymentFound = false;
                        _c = 0, twinDeployments_1 = twinDeployments;
                        _d.label = 3;
                    case 3:
                        if (!(_c < twinDeployments_1.length)) return [3 /*break*/, 6];
                        twinDeployment = twinDeployments_1[_c];
                        if (twinDeployment.nodeId !== node_id) {
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, deploymentFactory.UpdateDeployment(oldDeployment, twinDeployment.deployment)];
                    case 4:
                        oldDeployment = _d.sent();
                        deploymentFound = true;
                        if (!oldDeployment) {
                            return [3 /*break*/, 5];
                        }
                        finalTwinDeployments.push(new models_2.TwinDeployment(oldDeployment, models_2.Operations.update, 0, 0));
                        return [3 /*break*/, 6];
                    case 5:
                        _c++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!deploymentFound) {
                            finalTwinDeployments.push(new models_2.TwinDeployment(oldDeployment, models_2.Operations.delete, 0, 0));
                        }
                        _d.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 2];
                    case 8: return [4 /*yield*/, twinDeploymentHandler.handle(finalTwinDeployments)];
                    case 9:
                        contracts = _d.sent();
                        if (contracts.created.length === 0 && contracts.updated.length === 0 && contracts.deleted.length === 0) {
                            return [2 /*return*/, "Nothing found to update"];
                        }
                        this.save(options.name, contracts);
                        return [2 /*return*/, { "contracts": contracts }];
                }
            });
        });
    };
    Zdbs.prototype.add_zdb = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var deploymentObjs, deploymentFactory, zdbFactory, twinDeployment, contract_id, _i, deploymentObjs_2, deploymentObj, oldDeployment, newDeployment, deployment, twinDeploymentHandler, contracts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.exists(options.deployment_name)) {
                            throw Error("There is no zdb deployment with name: " + options.deployment_name);
                        }
                        return [4 /*yield*/, this._get(options.deployment_name)];
                    case 1:
                        deploymentObjs = _a.sent();
                        deploymentFactory = new deployment_1.DeploymentFactory();
                        zdbFactory = new zdb_1.Zdb();
                        twinDeployment = zdbFactory.create(options.name, options.node_id, options.namespace, options.disk_size, options.disk_type, options.mode, options.password, options.public, deploymentObjs[0].metadata, deploymentObjs[0].metadata);
                        contract_id = this._getContractIdFromNodeId(options.deployment_name, options.node_id);
                        if (!contract_id) return [3 /*break*/, 5];
                        _i = 0, deploymentObjs_2 = deploymentObjs;
                        _a.label = 2;
                    case 2:
                        if (!(_i < deploymentObjs_2.length)) return [3 /*break*/, 5];
                        deploymentObj = deploymentObjs_2[_i];
                        oldDeployment = deploymentFactory.fromObj(deploymentObj);
                        if (oldDeployment.contract_id !== contract_id) {
                            return [3 /*break*/, 4];
                        }
                        newDeployment = deploymentFactory.fromObj(deploymentObj);
                        newDeployment.workloads = newDeployment.workloads.concat(twinDeployment.deployment.workloads);
                        return [4 /*yield*/, deploymentFactory.UpdateDeployment(oldDeployment, newDeployment)];
                    case 3:
                        deployment = _a.sent();
                        twinDeployment.deployment = deployment;
                        twinDeployment.operation = models_2.Operations.update;
                        return [3 /*break*/, 5];
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler();
                        return [4 /*yield*/, twinDeploymentHandler.handle([twinDeployment])];
                    case 6:
                        contracts = _a.sent();
                        this.save(options.deployment_name, contracts);
                        return [2 /*return*/, { "contracts": contracts }];
                }
            });
        });
    };
    Zdbs.prototype.delete_zdb = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var zdb, twinDeploymentHandler, deployments, _i, deployments_1, deployment, twinDeployments, contracts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.exists(options.deployment_name)) {
                            throw Error("There is no zdb deployment with name: " + options.deployment_name);
                        }
                        zdb = new zdb_1.Zdb();
                        twinDeploymentHandler = new twinDeploymentHandler_1.TwinDeploymentHandler();
                        return [4 /*yield*/, this._get(options.deployment_name)];
                    case 1:
                        deployments = _a.sent();
                        _i = 0, deployments_1 = deployments;
                        _a.label = 2;
                    case 2:
                        if (!(_i < deployments_1.length)) return [3 /*break*/, 6];
                        deployment = deployments_1[_i];
                        return [4 /*yield*/, zdb.delete(deployment, [options.name])];
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
                    case 6: throw Error("zdb instance with name " + options.name + " is not found");
                }
            });
        });
    };
    __decorate([
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [models_1.ZDBS]),
        __metadata("design:returntype", Promise)
    ], Zdbs.prototype, "deploy", null);
    __decorate([
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Zdbs.prototype, "list", null);
    __decorate([
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], Zdbs.prototype, "get", null);
    __decorate([
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], Zdbs.prototype, "delete", null);
    __decorate([
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [models_1.ZDBS]),
        __metadata("design:returntype", Promise)
    ], Zdbs.prototype, "update", null);
    __decorate([
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [models_1.AddZDB]),
        __metadata("design:returntype", Promise)
    ], Zdbs.prototype, "add_zdb", null);
    __decorate([
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [models_1.DeleteZDB]),
        __metadata("design:returntype", Promise)
    ], Zdbs.prototype, "delete_zdb", null);
    return Zdbs;
}(base_1.BaseModule));
exports.zdbs = Zdbs;
