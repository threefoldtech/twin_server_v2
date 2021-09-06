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
exports.DeploymentFactory = void 0;
var grid3_client_1 = require("grid3_client");
var models_1 = require("./models");
var index_1 = require("../primitives/index");
var config_json_1 = __importDefault(require("../../config.json"));
var DeploymentFactory = /** @class */ (function () {
    function DeploymentFactory() {
        this.tfclient = new grid3_client_1.TFClient(config_json_1.default.url, config_json_1.default.mnemonic);
        this.rmb = new grid3_client_1.MessageBusClient();
    }
    DeploymentFactory.prototype.createContractAndSendToZos = function (deployment, node_id, hash, publicIPs) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, payload, node_twin_id, msg, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tfclient.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.tfclient.contracts.create(node_id, hash, "", publicIPs)];
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
    DeploymentFactory.prototype.merge = function (twinDeployments) {
        var deploymentMap = {};
        for (var _i = 0, twinDeployments_1 = twinDeployments; _i < twinDeployments_1.length; _i++) {
            var twinDeployment = twinDeployments_1[_i];
            if (twinDeployment.operation !== models_1.Operations.deploy) {
                continue;
            }
            if (Object.keys(deploymentMap).includes(twinDeployment.nodeId.toString())) {
                deploymentMap[twinDeployment.nodeId].deployment.workloads = deploymentMap[twinDeployment.nodeId].deployment.workloads.concat(twinDeployment.deployment.workloads);
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
    DeploymentFactory.prototype.handle = function (deployments, network) {
        if (network === void 0) { network = null; }
        return __awaiter(this, void 0, void 0, function () {
            var contracts, _i, deployments_1, twinDeployment, _a, _b, workload, hash, contract;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        deployments = this.merge(deployments);
                        contracts = [];
                        _i = 0, deployments_1 = deployments;
                        _c.label = 1;
                    case 1:
                        if (!(_i < deployments_1.length)) return [3 /*break*/, 6];
                        twinDeployment = deployments_1[_i];
                        for (_a = 0, _b = twinDeployment.deployment.workloads; _a < _b.length; _a++) {
                            workload = _b[_a];
                            if (workload.type === grid3_client_1.WorkloadTypes.network) {
                                workload["data"] = network.updateNetwork(workload.data);
                            }
                        }
                        hash = twinDeployment.deployment.challenge_hash();
                        twinDeployment.deployment.sign(config_json_1.default.twin_id, config_json_1.default.mnemonic);
                        if (!(twinDeployment.operation === models_1.Operations.deploy)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.createContractAndSendToZos(twinDeployment.deployment, twinDeployment.nodeId, hash, twinDeployment.publicIPs)];
                    case 2:
                        contract = _c.sent();
                        if (!network) return [3 /*break*/, 4];
                        return [4 /*yield*/, network.save(contract["contract_id"], twinDeployment.nodeId)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        contracts.push(contract);
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, contracts];
                }
            });
        });
    };
    return DeploymentFactory;
}());
exports.DeploymentFactory = DeploymentFactory;
