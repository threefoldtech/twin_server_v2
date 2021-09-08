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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var FS = __importStar(require("fs"));
var PATH = __importStar(require("path"));
var grid3_client_1 = require("grid3_client");
var expose_1 = require("./helpers/expose");
var jsonfs_1 = require("./helpers/jsonfs");
var modules = __importStar(require("./modules/index"));
var config_json_1 = __importDefault(require("../config.json"));
var Server = /** @class */ (function () {
    function Server(port) {
        if (port === void 0) { port = 6379; }
        this.server = new grid3_client_1.MessageBusServer(port);
    }
    Server.prototype.wrapFunc = function (message, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var parts, module, method, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parts = message.cmd.split(".");
                        module = parts[1];
                        method = parts[2];
                        obj = new modules[module]();
                        console.log("Executing Method: " + method + " in Module: " + module + " with Payload: " + payload);
                        return [4 /*yield*/, obj[method](JSON.parse(payload))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Server.prototype.register = function () {
        for (var _i = 0, _a = Object.getOwnPropertyNames(modules).filter(function (item) { return typeof modules[item] === 'function'; }); _i < _a.length; _i++) {
            var module_1 = _a[_i];
            var obj = new modules[module_1]();
            var props = Object.getPrototypeOf(obj);
            var methods = Object.getOwnPropertyNames(props);
            for (var _b = 0, methods_1 = methods; _b < methods_1.length; _b++) {
                var method = methods_1[_b];
                if (expose_1.isExposed(obj, method) == true) {
                    this.server.withHandler("twinserver." + module_1 + "." + method, this.wrapFunc);
                }
            }
        }
    };
    Server.prototype.run = function () {
        this.server.run();
    };
    return Server;
}());
if (!(config_json_1.default.url && config_json_1.default.mnemonic && config_json_1.default.twin_id)) {
    throw new Error("Invalid config");
}
var requiredFiles = ["network.json", "zdbs.json", "machines.json", "kubernetes.json"];
if (!FS.existsSync(jsonfs_1.appPath)) {
    FS.mkdirSync(jsonfs_1.appPath);
}
for (var _i = 0, requiredFiles_1 = requiredFiles; _i < requiredFiles_1.length; _i++) {
    var file = requiredFiles_1[_i];
    var path = PATH.join(jsonfs_1.appPath, file);
    if (!FS.existsSync(path)) {
        jsonfs_1.dumpToFile(path, {});
    }
}
var server = new Server();
server.register();
server.run();
