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
exports.Kubernetes = void 0;
var machine_1 = require("../high_level//machine");
var utils_1 = require("../helpers/utils");
var Flist = "https://hub.grid.tf/ahmed_hanafy_1/ahmedhanafy725-k3s-latest.flist";
var Kubernetes = /** @class */ (function () {
    function Kubernetes() {
    }
    Kubernetes.prototype.add_master = function (nodeId, secret, cpu, memory, diskSize, publicIp, network, sshKey, metadata, description) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var name, machine, env, disk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = utils_1.generateString(10);
                        machine = new machine_1.VirtualMachine();
                        env = {
                            "SSH_KEY": sshKey,
                            "K3S_TOKEN": secret,
                            "K3S_DATA_DIR": "/mnt/data",
                            "K3S_FLANNEL_IFACE": "eth0",
                            "K3S_NODE_NAME": name,
                            "K3S_URL": ""
                        };
                        disk = {
                            "size": diskSize,
                            "mountpoint": "/mnt/data" // it must be the same as the K3S_DATA_DIR
                        };
                        return [4 /*yield*/, machine.create(name, nodeId, Flist, cpu, memory, [disk], publicIp, network, "/sbin/zinit init", env, metadata, description)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Kubernetes.prototype.add_worker = function (nodeId, secret, masterIp, cpu, memory, diskSize, publicIp, network, sshKey, metadata, description) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var name, machine, env, disk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = utils_1.generateString(10);
                        machine = new machine_1.VirtualMachine();
                        env = {
                            "SSH_KEY": sshKey,
                            "K3S_TOKEN": secret,
                            "K3S_DATA_DIR": "/mnt/data",
                            "K3S_FLANNEL_IFACE": "eth0",
                            "K3S_NODE_NAME": name,
                            "K3S_URL": "https://" + masterIp + ":6443"
                        };
                        disk = {
                            "size": diskSize,
                            "mountpoint": "/mnt/data" // it must be the same as the K3S_DATA_DIR
                        };
                        return [4 /*yield*/, machine.create(name, nodeId, Flist, cpu, memory, [disk], publicIp, network, "/sbin/zinit init", env, metadata, description)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Kubernetes;
}());
exports.Kubernetes = Kubernetes;
