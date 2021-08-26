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
exports.createContractAndSendToZos = void 0;
var grid3_client_1 = require("grid3_client");
var config_json_1 = __importDefault(require("../../config.json"));
function createContractAndSendToZos(deployment, node_id, node_twin_id, hash, publicIPs) {
    return __awaiter(this, void 0, void 0, function () {
        var tfclient, contract, payload, rmb, msg, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tfclient = new grid3_client_1.TFClient(config_json_1.default.url, config_json_1.default.mnemonic);
                    return [4 /*yield*/, tfclient.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tfclient.contracts.create(node_id, hash, "", publicIPs)];
                case 2:
                    contract = _a.sent();
                    if (contract instanceof (Error)) {
                        throw Error("Failed to create contract " + contract);
                    }
                    console.log(contract);
                    deployment.contract_id = contract["contract_id"];
                    payload = JSON.stringify(deployment);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, 7, 8]);
                    rmb = new grid3_client_1.MessageBusClient();
                    msg = rmb.prepare("zos.deployment.deploy", [node_twin_id], 0, 2);
                    rmb.send(msg, payload);
                    return [4 /*yield*/, rmb.read(msg)];
                case 4:
                    result = _a.sent();
                    if (result[0].err) {
                        throw Error(result[0].err);
                    }
                    return [3 /*break*/, 8];
                case 5:
                    err_1 = _a.sent();
                    return [4 /*yield*/, tfclient.contracts.cancel(contract["contract_id"])];
                case 6:
                    _a.sent();
                    throw Error(err_1);
                case 7:
                    tfclient.disconnect();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/, contract];
            }
        });
    });
}
exports.createContractAndSendToZos = createContractAndSendToZos;
