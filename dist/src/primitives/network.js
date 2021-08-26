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
exports.Network = void 0;
var grid3_client_1 = require("grid3_client");
var Wg = require('wireguard-wrapper').Wg;
var Addr = require('netaddr').Addr;
var jsonfs_1 = require("../helpers/jsonfs");
var PATH = __importStar(require("path"));
// need to be gotten from proxy server
var AccessNodeID = 2;
// need to be gotten from rmb to the node
var WireguardPort = 12334;
var WireGuardKeys = /** @class */ (function () {
    function WireGuardKeys() {
    }
    return WireGuardKeys;
}());
var Network = /** @class */ (function () {
    function Network() {
    }
    Network.prototype.addPeer = function (subnet, wireguard_public_key, allowed_ips) {
        var peer = new grid3_client_1.Peer();
        peer.subnet = subnet;
        peer.wireguard_public_key = wireguard_public_key;
        peer.allowed_ips = allowed_ips;
        this.peers.push(peer);
    };
    Network.prototype.create = function (name, ip_range, machine_ip, node_id, metadata, description, version) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (version === void 0) { version = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, userSubnet, NodeSubnet, accessNodeSubnet, znet, keys, znet_workload;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.getUserNodeAccessNodeSubnets(name, ip_range, machine_ip, node_id), userSubnet = _a[0], NodeSubnet = _a[1], accessNodeSubnet = _a[2];
                        if (NodeSubnet && accessNodeSubnet && this.getNetworkNames().includes(name)) {
                            // update network on the access node and deploy network on the new node
                        }
                        else if (NodeSubnet && accessNodeSubnet && !this.getNetworkNames().includes(name)) {
                            // deploy network on the access node and deploy network on the new node
                        }
                        else if (NodeSubnet && !accessNodeSubnet && !this.getNetworkNames().includes(name)) {
                            // deploy only on the access node with is the new node as well
                        }
                        else {
                            // do nothing
                        }
                        znet = new grid3_client_1.Znet();
                        znet.subnet = NodeSubnet;
                        znet.ip_range = ip_range;
                        return [4 /*yield*/, this._generateWireguardKeypair()];
                    case 1:
                        keys = _b.sent();
                        znet.wireguard_private_key = keys.privateKey;
                        znet.wireguard_listen_port = WireguardPort;
                        // Add peers before set them on the network workload
                        znet.peers = this.peers;
                        znet_workload = new grid3_client_1.Workload();
                        znet_workload.version = version || 0;
                        znet_workload.name = name;
                        znet_workload.type = grid3_client_1.WorkloadTypes.network;
                        znet_workload.data = znet;
                        znet_workload.metadata = metadata;
                        znet_workload.description = description;
                        return [2 /*return*/, znet_workload];
                }
            });
        });
    };
    Network.prototype._generateWireguardKeypair = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Wg.genkey().then(function (privateKey) {
                        return Wg.pubkey(privateKey).then(function (publicKey) {
                            var wireguardKeys = new WireGuardKeys();
                            wireguardKeys.privateKey = privateKey;
                            wireguardKeys.publicKey = publicKey;
                            return wireguardKeys;
                        });
                    })];
            });
        });
    };
    Network.prototype._getPublicKey = function (privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Wg.pubkey(privateKey).then(function (publicKey) {
                        return publicKey;
                    })];
            });
        });
    };
    Network.prototype.getNetworks = function () {
        var path = PATH.join(jsonfs_1.appPath, "network.json");
        return jsonfs_1.loadFromFile(path);
    };
    Network.prototype.getNetworkNames = function () {
        var networks = this.getNetworks();
        return Object.keys(networks);
    };
    Network.prototype.getUserNodeAccessNodeSubnets = function (name, ip_range, machine_ip, node_id) {
        var targetNodeSubnet = "";
        if (!machine_ip) {
            targetNodeSubnet = Addr(machine_ip).mask(24).toString();
        }
        var networkRange = new Addr(ip_range);
        var subnet = networkRange.mask(24);
        if (this.getNetworkNames().includes(name)) {
            var network = this.getNetworks()[name];
            if (ip_range !== network.ip_range) {
                throw Error("There is another network with the same name and different IP range");
            }
            if (network.subnet === targetNodeSubnet) {
                throw Error("Can't assign this subnet " + targetNodeSubnet + " to node " + node_id + ". Subnet already assign to your wireguard config");
            }
            if (network.subnet === subnet.toString()) {
                subnet = subnet.nextSibling();
            }
            else {
                for (var i = 0; i < network.nodes.length; i++) {
                    if (network.nodes[i].subnet === targetNodeSubnet) {
                        if (network.nodes[i].node_id !== node_id) {
                            throw Error("Can't assign this subnet " + targetNodeSubnet + " to node " + node_id + ". Subnet already assign to node_id " + network.nodes[i].node_id);
                        }
                        else {
                            return [network.subnet, "", ""];
                        }
                    }
                    var accessNodeSubnet = "";
                    if (network.nodes[i].node_id === AccessNodeID) {
                        accessNodeSubnet = network.nodes[i].subnet;
                    }
                    if (network.nodes[i].subnet === subnet.toString()) {
                        subnet = subnet.nextSibling();
                    }
                    else {
                        return [network.subnet, subnet.toString(), accessNodeSubnet];
                    }
                }
            }
        }
        else {
            var subnets = void 0;
            if (targetNodeSubnet === "") {
                subnets = [subnet.toString(), subnet.nextSibling().nextSibling().toString(), subnet.nextSibling().toString()];
            }
            else {
                if (targetNodeSubnet === subnet.toString()) {
                    subnets = [subnet.nextSibling().toString(), subnet.toString(), subnet.nextSibling().nextSibling().toString()];
                }
                else {
                    subnets = [subnet.toString(), targetNodeSubnet, Addr(targetNodeSubnet).nextSibling().nextSibling().toString()];
                }
            }
            if (AccessNodeID === node_id) {
                subnets.pop();
                subnets.push("");
            }
            return subnets;
        }
    };
    return Network;
}());
exports.Network = Network;
