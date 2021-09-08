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
exports.machine = void 0;
var base_1 = require("./base");
var models_1 = require("./models");
var index_1 = require("../primitives/index");
var expose_1 = require("../helpers/expose");
var machine_1 = require("../high_level/machine");
var deploymentFactory_1 = require("../high_level/deploymentFactory");
var Machine = /** @class */ (function (_super) {
    __extends(Machine, _super);
    function Machine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fileName = "machines.json";
        return _this;
    }
    Machine.prototype.deploy = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var networkName, network, vm, _a, twinDeployments, wgConfig, deploymentFactory, contracts, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this._get(options.name)) {
                            throw Error("Another machine deployment with the same name " + options.name + " is already exist");
                        }
                        networkName = options.network.name;
                        network = new index_1.Network(networkName, options.network.ip_range);
                        return [4 /*yield*/, network.load(true)];
                    case 1:
                        _b.sent();
                        vm = new machine_1.VirtualMachine();
                        return [4 /*yield*/, vm.create(options.name, options.node_id, options.flist, options.cpu, options.memory, options.disks, options.public_ip, network, options.entrypoint, options.env, options.metadata, options.description)];
                    case 2:
                        _a = _b.sent(), twinDeployments = _a[0], wgConfig = _a[1];
                        deploymentFactory = new deploymentFactory_1.DeploymentFactory();
                        return [4 /*yield*/, deploymentFactory.handle(twinDeployments, network)];
                    case 3:
                        contracts = _b.sent();
                        data = this.save(options.name, contracts, wgConfig);
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Machine.prototype.get = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._get(options.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Machine.prototype.delete = function (options) {
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
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [models_1.Machines]),
        __metadata("design:returntype", Promise)
    ], Machine.prototype, "deploy", null);
    __decorate([
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], Machine.prototype, "get", null);
    __decorate([
        expose_1.expose,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], Machine.prototype, "delete", null);
    return Machine;
}(base_1.BaseModule));
exports.machine = Machine;
