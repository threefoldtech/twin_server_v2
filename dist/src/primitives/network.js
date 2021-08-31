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
var Wg = require('wireguard-wrapper').Wg;
var Addr = require('netaddr').Addr;
var Private = require("private-ip");
var grid3_client_1 = require("grid3_client");
var jsonfs_1 = require("../helpers/jsonfs");
var PATH = __importStar(require("path"));
var utils_1 = require("../helpers/utils");
var utils_2 = require("./utils");
var WireGuardKeys = /** @class */ (function () {
    function WireGuardKeys() {
    }
    return WireGuardKeys;
}());
var Node = /** @class */ (function () {
    function Node() {
    }
    return Node;
}());
var AccessPoint = /** @class */ (function () {
    function AccessPoint() {
    }
    return AccessPoint;
}());
var Network = /** @class */ (function () {
    function Network(name, ip_range) {
        this.name = name;
        this.ipRange = ip_range;
        if (Addr(ip_range).prefix !== 16) {
            throw Error("Network ip_range should be with prefix 16");
        }
        if (!this.isPrivateIP(ip_range)) {
            throw Error("Network ip_range should be private range");
        }
        this.load(true);
    }
    Network.prototype.addAccess = function () {
    };
    Network.prototype.addNode = function (node_id, metadata, description) {
        return __awaiter(this, void 0, void 0, function () {
            var keypair, znet, _a, _i, _b, net, znet_workload;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.nodeExists(node_id)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.generateWireguardKeypair()];
                    case 1:
                        keypair = _c.sent();
                        znet = new grid3_client_1.Znet();
                        znet.subnet = this.getFreeSubnet();
                        znet.ip_range = this.ipRange;
                        znet.wireguard_private_key = keypair.privateKey;
                        _a = znet;
                        return [4 /*yield*/, this.getFreePort(node_id)];
                    case 2:
                        _a.wireguard_listen_port = _c.sent();
                        this.networks.push(znet);
                        this.generatePeers();
                        this.updateNetworkDeployments();
                        for (_i = 0, _b = this.networks; _i < _b.length; _i++) {
                            net = _b[_i];
                            if (net.subnet === znet.subnet) {
                                znet = net;
                            }
                        }
                        znet_workload = new grid3_client_1.Workload();
                        znet_workload.version = 0;
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
    Network.prototype.updateNetworkDeployments = function () {
        for (var _i = 0, _a = this.networks; _i < _a.length; _i++) {
            var net = _a[_i];
            for (var _b = 0, _c = this.deployments; _b < _c.length; _b++) {
                var deployment = _c[_b];
                var workloads = deployment["workloads"];
                for (var _d = 0, workloads_1 = workloads; _d < workloads_1.length; _d++) {
                    var workload = workloads_1[_d];
                    if (workload["type"] !== grid3_client_1.WorkloadTypes.network) {
                        continue;
                    }
                    if (net.subnet !== workload["data"]["subnet"]) {
                        continue;
                    }
                    workload["data"] = net;
                    break;
                }
                deployment["workloads"] = workloads;
            }
        }
    };
    Network.prototype.load = function (deployments) {
        if (deployments === void 0) { deployments = false; }
        return __awaiter(this, void 0, void 0, function () {
            var networks, network, _i, _a, node, n, rmbCL, _b, _c, node, node_twin_id, msg, result, res, _d, _e, workload, znet;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        networks = this.getNetworks();
                        if (!Object.keys(networks).includes(this.name)) {
                            return [2 /*return*/];
                        }
                        network = networks[this.name];
                        if (network.ip_range !== this.ipRange) {
                            throw Error("The same network name " + this.name + " with different ip range is already exist");
                        }
                        for (_i = 0, _a = network.nodes; _i < _a.length; _i++) {
                            node = _a[_i];
                            n = node;
                            this.nodes.push(n);
                        }
                        if (!deployments) return [3 /*break*/, 6];
                        rmbCL = new grid3_client_1.MessageBusClient();
                        _b = 0, _c = this.nodes;
                        _f.label = 1;
                    case 1:
                        if (!(_b < _c.length)) return [3 /*break*/, 5];
                        node = _c[_b];
                        return [4 /*yield*/, utils_2.getNodeTwinId(node.node_id)];
                    case 2:
                        node_twin_id = _f.sent();
                        msg = rmbCL.prepare("zos.deployment.get", [node_twin_id], 0, 2);
                        rmbCL.send(msg, JSON.stringify({ "contract_id": node.contract_id }));
                        return [4 /*yield*/, rmbCL.read(msg)];
                    case 3:
                        result = _f.sent();
                        if (result[0].err) {
                            console.error("Could not load network deployment " + node.contract_id + " due to error: " + result[0].err);
                        }
                        res = JSON.parse(result[0].dat);
                        res["node_id"] = node.node_id;
                        this.deployments.push(res);
                        for (_d = 0, _e = res["workloads"]; _d < _e.length; _d++) {
                            workload = _e[_d];
                            if (workload["type"] !== grid3_client_1.WorkloadTypes.network) {
                                continue;
                            }
                            znet = workload["data"];
                            znet["node_id"] = node.node_id;
                            this.networks.push(znet);
                        }
                        _f.label = 4;
                    case 4:
                        _b++;
                        return [3 /*break*/, 1];
                    case 5:
                        this.getAccessPoints();
                        _f.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Network.prototype.exists = function () {
        return this.getNetworkNames().includes(this.name);
    };
    Network.prototype.nodeExists = function (node_id) {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.node_id === node_id) {
                return true;
            }
        }
        return false;
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
    Network.prototype.getFreeIP = function (node_id, subnet) {
        if (subnet === void 0) { subnet = ""; }
        var ip;
        if (!this.nodeExists(node_id) && subnet) {
            ip = Addr(subnet).mask(32);
        }
        else if (this.nodeExists(node_id)) {
            ip = Addr(this.getNodeSubnet(node_id)).mask(32);
            var reserved_ips = this.getNodeReservedIps(node_id);
            while (reserved_ips.includes(ip.toString().split("/")[0])) {
                ip = ip.increment();
            }
        }
        else {
            throw Error("node_id or subnet must be specified");
        }
        if (ip) {
            ip = ip.toString().split("/")[0];
            var found = false;
            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.node_id === node_id) {
                    node.reserved_ips.push(ip);
                    found = true;
                    break;
                }
            }
            if (!found) {
                var node = new Node();
                node.node_id = node_id;
                node.reserved_ips = [ip];
                this.nodes.push(node);
            }
            return ip;
        }
    };
    Network.prototype.getNodeReservedIps = function (node_id) {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.node_id !== node_id) {
                continue;
            }
            return node.reserved_ips;
        }
    };
    Network.prototype.getNodeSubnet = function (node_id) {
        for (var _i = 0, _a = this.deployments; _i < _a.length; _i++) {
            var deployment = _a[_i];
            if (deployment["node_id"] !== node_id) {
                continue;
            }
            for (var _b = 0, _c = deployment["workloads"]; _b < _c.length; _b++) {
                var workload = _c[_b];
                if (workload["type"] !== grid3_client_1.WorkloadTypes.network) {
                    continue;
                }
                return workload["data"]["subnet"];
            }
        }
    };
    Network.prototype.getReservedSubnets = function () {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            var subnet = this.getNodeSubnet(node.node_id);
            if (subnet && !this.reservedSubnets.includes(subnet)) {
                this.reservedSubnets.push(subnet);
            }
        }
        for (var _b = 0, _c = this.networks; _b < _c.length; _b++) {
            var network = _c[_b];
            if (!this.reservedSubnets.includes(network.subnet)) {
                this.reservedSubnets.push(network.subnet);
            }
        }
        return this.reservedSubnets;
    };
    Network.prototype.getFreeSubnet = function () {
        var reservedSubnets = this.getReservedSubnets();
        var subnet = Addr(this.ipRange).mask(24);
        while (reservedSubnets.includes(subnet.toString())) {
            subnet = subnet.increment();
        }
        this.reservedSubnets.push(subnet.toString());
        return subnet.toString();
    };
    Network.prototype.getAccessPoints = function () {
        var nodesWGPubkeys = [];
        for (var _i = 0, _a = this.networks; _i < _a.length; _i++) {
            var network = _a[_i];
            var pubkey = this.getPublicKey(network.wireguard_private_key);
            nodesWGPubkeys.push(pubkey);
        }
        for (var _b = 0, _c = this.networks; _b < _c.length; _b++) {
            var network = _c[_b];
            for (var _d = 0, _e = network.peers; _d < _e.length; _d++) {
                var peer = _e[_d];
                if (nodesWGPubkeys.includes(peer.wireguard_public_key)) {
                    continue;
                }
                var accessPoint = new AccessPoint();
                accessPoint.subnet = peer.subnet;
                accessPoint.wireguard_public_key = peer.wireguard_public_key;
                accessPoint.node_id = network["node_id"];
                this.accessPoints.push(accessPoint);
            }
        }
        return this.accessPoints;
    };
    Network.prototype.getNetworks = function () {
        var path = PATH.join(jsonfs_1.appPath, "network.json");
        return jsonfs_1.loadFromFile(path);
    };
    Network.prototype.getNetworkNames = function () {
        var networks = this.getNetworks();
        return Object.keys(networks);
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
    Network.prototype.wgRoutingIP = function (subnet) {
        var subnetsParts = subnet.split(".");
        return "100.64." + subnetsParts[1] + "." + subnetsParts[2].split("/")[0] + "/32";
    };
    Network.prototype.getWireguardConfig = function (subnet, userprivKey, peerPubkey, endpoint) {
        var userIP = this.wgRoutingIP(subnet);
        var networkIP = this.wgRoutingIP(this.ipRange);
        return "[Interface]\nAddress = " + userIP + "\n\n        PrivateKey = " + userprivKey + "\n[Peer]\nPublicKey = " + peerPubkey + "\n\n        AllowedIPs = " + this.ipRange + ", " + networkIP + "\n\n        PersistentKeepalive = 25\nEndpoint = " + endpoint;
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
                        "ip_range": this.ipRange,
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
    Network.prototype.generatePeers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, n, _b, _c, net, allowed_ips, _d, _e, accessPoint, accessIP, peer, _f, _g, _h, accessPoint, allowed_ips, peer;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _i = 0, _a = this.networks;
                        _j.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        n = _a[_i];
                        n.peers = [];
                        _b = 0, _c = this.networks;
                        _j.label = 2;
                    case 2:
                        if (!(_b < _c.length)) return [3 /*break*/, 6];
                        net = _c[_b];
                        if (n["node_id"] === net["node_id"]) {
                            return [3 /*break*/, 5];
                        }
                        allowed_ips = [];
                        allowed_ips.push(net.subnet);
                        allowed_ips.push(this.wgRoutingIP(net.subnet));
                        // add access points as allowed ips if this node "net" is the access node and has access point to it
                        for (_d = 0, _e = this.accessPoints; _d < _e.length; _d++) {
                            accessPoint = _e[_d];
                            if (accessPoint.node_id === net["node_id"]) {
                                allowed_ips.push(accessPoint.subnet);
                                allowed_ips.push(this.wgRoutingIP(accessPoint.subnet));
                            }
                        }
                        return [4 /*yield*/, this.getNodeEndpoint(net["node_id"])];
                    case 3:
                        accessIP = _j.sent();
                        peer = new grid3_client_1.Peer();
                        peer.subnet = net.subnet;
                        _f = peer;
                        return [4 /*yield*/, this.getPublicKey(net.wireguard_private_key)];
                    case 4:
                        _f.wireguard_public_key = _j.sent();
                        peer.allowed_ips = allowed_ips;
                        peer.endpoint = accessIP + ":" + net.wireguard_listen_port;
                        n.peers.push(peer);
                        _j.label = 5;
                    case 5:
                        _b++;
                        return [3 /*break*/, 2];
                    case 6:
                        for (_g = 0, _h = this.accessPoints; _g < _h.length; _g++) {
                            accessPoint = _h[_g];
                            if (n["node_id"] === accessPoint.node_id) {
                                allowed_ips = [];
                                allowed_ips.push(accessPoint.subnet);
                                allowed_ips.push(this.wgRoutingIP(accessPoint.subnet));
                                peer = new grid3_client_1.Peer();
                                peer.subnet = accessPoint.subnet;
                                peer.wireguard_public_key = accessPoint.wireguard_public_key;
                                peer.allowed_ips = allowed_ips;
                                peer.endpoint = "";
                                n.peers.push(peer);
                            }
                        }
                        _j.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return Network;
}());
exports.Network = Network;
