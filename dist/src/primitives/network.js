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
var Private = require("private-ip");
var jsonfs_1 = require("../helpers/jsonfs");
var PATH = __importStar(require("path"));
var utils_1 = require("../helpers/utils");
var utils_2 = require("./utils");
var WireGuardKeys = /** @class */ (function () {
    function WireGuardKeys() {
    }
    return WireGuardKeys;
}());
var Peers = /** @class */ (function () {
    function Peers() {
    }
    Peers.prototype.addPeer = function (subnet, wireguard_public_key, allowed_ips) {
        var peer = new grid3_client_1.Peer();
        peer.subnet = subnet;
        peer.wireguard_public_key = wireguard_public_key;
        peer.allowed_ips = allowed_ips;
        this.peers.push(peer);
    };
    return Peers;
}());
var Node = /** @class */ (function () {
    function Node() {
    }
    return Node;
}());
var Network = /** @class */ (function () {
    function Network(name, ip_range) {
        this.name = name;
        this.ip_range = ip_range;
        this.load();
    }
    Network.prototype.addAccess = function () {
    };
    Network.prototype.addNode = function () {
    };
    Network.prototype.load = function (workloads) {
        if (workloads === void 0) { workloads = false; }
        var networks = this.getNetworks();
        if (!Object.keys(networks).includes(this.name)) {
            return;
        }
        var network = networks[this.name];
        if (network.ip_range !== this.ip_range) {
            throw Error("The same network name with different ip range is exist");
        }
        this.userPrivKey = network.wireguard_private_key;
        this.accessPubKey = network.access_node_public_key;
        this.userSubnet = network.subnet;
        this.accessSubnet = network.access_subnet;
        this.accessNodeId = network.access_node_id;
        this.endpoint = network.endpoint;
        for (var _i = 0, _a = network.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            var n = node;
            this.nodes.push(n);
        }
        if (workloads) {
            // load workload from nodes
        }
    };
    Network.prototype.exists = function () {
        return this.getNetworkNames().includes(this.name);
    };
    Network.prototype.nodeExists = function (node_id) {
        this.load();
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.node_id === node_id) {
                return true;
            }
        }
        return false;
    };
    Network.prototype.create = function (ip_range, machine_ip, node_id, metadata, description, version) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (version === void 0) { version = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var znet, znet_workload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setupNetworkConfig(ip_range, machine_ip, node_id)];
                    case 1:
                        znet = _a.sent();
                        if (!znet) {
                            return [2 /*return*/];
                        }
                        znet_workload = new grid3_client_1.Workload();
                        znet_workload.version = version || 0;
                        znet_workload.name = this.name;
                        znet_workload.type = grid3_client_1.WorkloadTypes.network;
                        znet_workload.data = znet;
                        znet_workload.metadata = metadata;
                        znet_workload.description = description;
                        return [2 /*return*/, znet_workload];
                }
            });
        });
    };
    Network.prototype.generateWireguardKeypair = function () {
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
    Network.prototype.getPublicKey = function (privateKey) {
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
    Network.prototype.getUserNodeAccessNodeSubnets = function (ip_range, machine_ip, node_id) {
        var targetNodeSubnet = "";
        if (!machine_ip) {
            targetNodeSubnet = Addr(machine_ip).mask(24).toString();
        }
        var networkRange = new Addr(ip_range);
        var subnet = networkRange.mask(24);
        if (this.getNetworkNames().includes(this.name)) {
            var network = this.getNetworks()[this.name];
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
                            if (network.nodes[i].reserved_ips.includes(machine_ip)) {
                                throw Error("Can't assign this ip to the machine. it's already reserved");
                            }
                            return [network.subnet, "", ""];
                        }
                    }
                    var accessNodeSubnet = "";
                    if (Object.keys(utils_2.getAccessNodes()).includes(network.nodes[i].node_id)) {
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
            if (Object.keys(utils_2.getAccessNodes()).includes(node_id)) {
                subnets.pop();
                subnets.push("");
            }
            return subnets;
        }
    };
    Network.prototype.getFreePort = function (node_id) {
        return __awaiter(this, void 0, void 0, function () {
            var node_twin_id, rmbCL, msg, result, port;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_2.getNodeTwinId(node_id)];
                    case 1:
                        node_twin_id = _a.sent();
                        rmbCL = new grid3_client_1.MessageBusClient();
                        msg = rmbCL.prepare("zos.network.list_wg_ports", [node_twin_id], 0, 2);
                        rmbCL.send(msg, "");
                        return [4 /*yield*/, rmbCL.read(msg)];
                    case 2:
                        result = _a.sent();
                        console.log(result);
                        port = 0;
                        while (!port || JSON.parse(result[0].dat).includes(port)) {
                            port = utils_1.getRandomNumber(1000, 65536);
                        }
                        return [2 /*return*/, port];
                }
            });
        });
    };
    Network.prototype.isPrivateIP = function (ip) {
        return Private(ip);
    };
    Network.prototype.getNodeEndpoint = function (node_id) {
        return __awaiter(this, void 0, void 0, function () {
            var node_twin_id, rmbCL, msg, result, data, ipv4, ipv6, data, _i, _a, iface, _b, _c, ip;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, utils_2.getNodeTwinId(node_id)];
                    case 1:
                        node_twin_id = _d.sent();
                        rmbCL = new grid3_client_1.MessageBusClient();
                        msg = rmbCL.prepare("zos.network.public_config_get", [node_twin_id], 0, 2);
                        rmbCL.send(msg, "");
                        return [4 /*yield*/, rmbCL.read(msg)];
                    case 2:
                        result = _d.sent();
                        console.log(result);
                        if (!result[0].err && result[0].dat) {
                            data = JSON.parse(result[0].dat);
                            ipv4 = data.ipv4;
                            if (!this.isPrivateIP(ipv4)) {
                                return [2 /*return*/, ipv4.split("/")[0]];
                            }
                            ipv6 = data.ipv6;
                            if (!this.isPrivateIP(ipv6)) {
                                return [2 /*return*/, ipv6.split("/")[0]];
                            }
                        }
                        console.log("node " + node_id + " has no public config");
                        msg = rmbCL.prepare("zos.network.interfaces", [node_twin_id], 0, 2);
                        rmbCL.send(msg, "");
                        return [4 /*yield*/, rmbCL.read(msg)];
                    case 3:
                        result = _d.sent();
                        console.log(result);
                        if (!result[0].err && result[0].dat) {
                            data = JSON.parse(result[0].dat);
                            for (_i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                                iface = _a[_i];
                                if (iface === "ygg0") {
                                    continue;
                                }
                                for (_b = 0, _c = data[iface]; _b < _c.length; _b++) {
                                    ip = _c[_b];
                                    if (!this.isPrivateIP(ip)) {
                                        return [2 /*return*/, ip];
                                    }
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Network.prototype.getUserWireguardConfig = function () {
        this.load();
        var nodeSubnetParts = this.userSubnet.split(".");
        var accessNodeSubnetParts = this.accessSubnet.split(".");
        return "[Interface]\nAddress = 100.64." + nodeSubnetParts[2] + "." + nodeSubnetParts[3].split("/")[0] + "/32\n\n        PrivateKey = " + this.userPrivKey + "\n[Peer]\nPublicKey = " + this.accessPubKey + "\n\n        AllowedIPs = " + this.accessSubnet + ", 100.64." + accessNodeSubnetParts[2] + "." + accessNodeSubnetParts[3].split("/")[0] + "/32\n\n        PersistentKeepalive = 25\nEndpoint = " + this.endpoint;
    };
    Network.prototype.setupNetworkConfig = function (ip_range, machine_ip, node_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, userSubnet, NodeSubnet, accessNodeSubnet, userKeypair, nodeKeypair, znet, _b, parts, allowed_ips, peers;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.getUserNodeAccessNodeSubnets(ip_range, machine_ip, node_id), userSubnet = _a[0], NodeSubnet = _a[1], accessNodeSubnet = _a[2];
                        this.userSubnet = userSubnet;
                        if (!(NodeSubnet && accessNodeSubnet && this.getNetworkNames().includes(this.name))) return [3 /*break*/, 1];
                        // update network on the access node and deploy network on the new node
                        throw Error("Update network is not implemented yet.");
                    case 1:
                        if (!(NodeSubnet && accessNodeSubnet && !this.getNetworkNames().includes(this.name))) return [3 /*break*/, 2];
                        // deploy network on the access node and deploy network on the new node
                        throw Error("Deploy network on 2 different nodes is not implemented yet.");
                    case 2:
                        if (!(NodeSubnet && !accessNodeSubnet && !this.getNetworkNames().includes(this.name))) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.generateWireguardKeypair()];
                    case 3:
                        userKeypair = _c.sent();
                        return [4 /*yield*/, this.generateWireguardKeypair()];
                    case 4:
                        nodeKeypair = _c.sent();
                        this.userPrivKey = userKeypair.privateKey;
                        this.accessPubKey = nodeKeypair.publicKey;
                        this.accessSubnet = NodeSubnet;
                        znet = new grid3_client_1.Znet();
                        znet.subnet = NodeSubnet;
                        znet.ip_range = ip_range;
                        znet.wireguard_private_key = nodeKeypair.privateKey;
                        _b = znet;
                        return [4 /*yield*/, this.getFreePort(node_id)];
                    case 5:
                        _b.wireguard_listen_port = _c.sent();
                        parts = userSubnet.split(".");
                        allowed_ips = [userSubnet, "100.64." + parts[2] + "." + parts[3].split("/")[0] + "/32"];
                        peers = new Peers();
                        peers.addPeer(userSubnet, userKeypair.publicKey, allowed_ips);
                        znet.peers = peers.peers;
                        // store this config on network config on filesystem
                        return [2 /*return*/, znet];
                    case 6: 
                    // do nothing
                    return [2 /*return*/];
                }
            });
        });
    };
    Network.prototype.save = function (contract_id, machine_ip, node_id) {
        return __awaiter(this, void 0, void 0, function () {
            var network, nodeFound, node, node, networks, path;
            return __generator(this, function (_a) {
                if (this.exists()) {
                    network = this.getNetworks()[this.name];
                }
                else {
                    network = {
                        "access_node_id": this.accessNodeId,
                        "ip_range": this.ip_range,
                        "subnet": this.userSubnet,
                        "access_subnet": this.accessSubnet,
                        "wireguard_private_key": this.userPrivKey,
                        "access_node_public_key": this.accessPubKey,
                        "endpoint": this.endpoint,
                        "nodes": []
                    };
                }
                nodeFound = false;
                for (node in network.nodes) {
                    if (node["node_id"] === node_id) {
                        node["reserved_ips"].append(machine_ip);
                        nodeFound = true;
                        break;
                    }
                }
                if (!nodeFound) {
                    node = {
                        "contract_id": contract_id,
                        "node_id": node_id,
                        "reserved_ips": [machine_ip],
                    };
                    network.nodes.push(node);
                }
                networks = this.getNetworks();
                networks[this.name] = network;
                path = PATH.join(jsonfs_1.appPath, "network.json");
                jsonfs_1.dumpToFile(path, networks);
                return [2 /*return*/];
            });
        });
    };
    return Network;
}());
exports.Network = Network;
