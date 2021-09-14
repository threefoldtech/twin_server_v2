"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.BaseModule = void 0;
var PATH = __importStar(require("path"));
var grid3_client_1 = require("grid3_client");
var base_1 = require("../high_level/base");
var jsonfs_1 = require("../helpers/jsonfs");
var nodes_1 = require("../primitives/nodes");
var BaseModule = /** @class */ (function () {
    function BaseModule() {
        this.fileName = "";
    }
    BaseModule.prototype.save = function (name, contracts, wgConfig) {
        if (wgConfig === void 0) { wgConfig = ""; }
        var contractIds = [];
        for (var _i = 0, contracts_1 = contracts; _i < contracts_1.length; _i++) {
            var contract = contracts_1[_i];
            contractIds.push({ "contract_id": contract["contract_id"], "node_id": contract["node_id"] });
        }
        var data = { "contracts": contractIds };
        if (wgConfig) {
            data["wireguard_config"] = wgConfig;
        }
        var path = PATH.join(jsonfs_1.appPath, this.fileName);
        jsonfs_1.updatejson(path, name, data);
        return data;
    };
    BaseModule.prototype._list = function () {
        var path = PATH.join(jsonfs_1.appPath, this.fileName);
        var data = jsonfs_1.loadFromFile(path);
        return Object.keys(data);
    };
    BaseModule.prototype.exists = function (name) {
        return this._list().includes(name);
    };
    BaseModule.prototype._getDeploymentNodeIds = function (name) {
        var path = PATH.join(jsonfs_1.appPath, this.fileName);
        var data = jsonfs_1.loadFromFile(path);
        if (!data.hasOwnProperty(name)) {
            return [];
        }
        var nodeIds = [];
        for (var _i = 0, _a = data[name]["contracts"]; _i < _a.length; _i++) {
            var contract = _a[_i];
            nodeIds.push(contract["node_id"]);
        }
        return nodeIds;
    };
    BaseModule.prototype._get = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var path, data, deployments, rmb, _i, _a, contract, node_twin_id, payload, msg, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        path = PATH.join(jsonfs_1.appPath, this.fileName);
                        data = jsonfs_1.loadFromFile(path);
                        if (!data.hasOwnProperty(name)) {
                            return [2 /*return*/, []];
                        }
                        deployments = [];
                        rmb = new grid3_client_1.MessageBusClient();
                        _i = 0, _a = data[name]["contracts"];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        contract = _a[_i];
                        return [4 /*yield*/, nodes_1.getNodeTwinId(contract["node_id"])];
                    case 2:
                        node_twin_id = _b.sent();
                        payload = JSON.stringify({ "contract_id": contract["contract_id"] });
                        msg = rmb.prepare("zos.deployment.get", [node_twin_id], 0, 2);
                        rmb.send(msg, payload);
                        return [4 /*yield*/, rmb.read(msg)];
                    case 3:
                        result = _b.sent();
                        if (result[0].err) {
                            throw Error(result[0].err);
                        }
                        deployments.push(JSON.parse(result[0].dat));
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, deployments];
                }
            });
        });
    };
    BaseModule.prototype._delete = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var path, data, contracts, deployments, highlvl, _i, deployments_1, deployment, contract;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = PATH.join(jsonfs_1.appPath, this.fileName);
                        data = jsonfs_1.loadFromFile(path);
                        if (!data.hasOwnProperty(name)) {
                            return [2 /*return*/, []];
                        }
                        contracts = { "deleted": [], "updated": [] };
                        return [4 /*yield*/, this._get(name)];
                    case 1:
                        deployments = _a.sent();
                        highlvl = new base_1.HighLevelBase;
                        _i = 0, deployments_1 = deployments;
                        _a.label = 2;
                    case 2:
                        if (!(_i < deployments_1.length)) return [3 /*break*/, 5];
                        deployment = deployments_1[_i];
                        return [4 /*yield*/, highlvl._delete(deployment, [])];
                    case 3:
                        contract = _a.sent();
                        contracts.deleted = contracts.deleted.concat(contract["deleted"]);
                        contracts.updated = contracts.updated.concat(contract["updated"]);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        jsonfs_1.updatejson(path, name, "", "delete");
                        return [2 /*return*/, contracts];
                }
            });
        });
    };
    return BaseModule;
}());
exports.BaseModule = BaseModule;
