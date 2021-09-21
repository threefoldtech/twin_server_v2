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
var Private = require("private-ip");
var PATH = __importStar(require("path"));
var netaddr_1 = require("netaddr");
var grid3_client_1 = require("grid3_client");
var jsonfs_1 = require("../helpers/jsonfs");
var utils_1 = require("../helpers/utils");
var nodes_1 = require("./nodes");
var WireGuardKeys = /** @class */ (function () {
    function WireGuardKeys() {
    }
    return WireGuardKeys;
}());
var Node = /** @class */ (function () {
    function Node() {
        this.reserved_ips = [];
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
        this.nodes = [];
        this.deployments = [];
        this.reservedSubnets = [];
        this.networks = [];
        this.accessPoints = [];
        this.name = name;
        this.ipRange = ip_range;
        if (netaddr_1.Addr(ip_range).prefix !== 16) {
            throw Error("Network ip_range should be with prefix 16");
        }
        if (!this.isPrivateIP(ip_range)) {
            throw Error("Network ip_range should be private range");
        }
    }
    Network.prototype.addAccess = function (node_id, ipv4) {
        return __awaiter(this, void 0, void 0, function () {
            var accessNodes, nodeWGListeningPort, endpoint, nodesWGPubkey, keypair, accessPoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.nodeExists(node_id)) {
                            throw Error("Node " + node_id + " does not exist in the network. Please add it first");
                        }
                        return [4 /*yield*/, nodes_1.getAccessNodes()];
                    case 1:
                        accessNodes = _a.sent();
                        if (Object.keys(accessNodes).includes(node_id.toString())) {
                            if (ipv4 && !accessNodes[node_id]["ipv4"]) {
                                throw Error("Node " + node_id + " does not have ipv4 public config.");
                            }
                        }
                        else {
                            throw Error("Node " + node_id + " is not an access node.");
                        }
                        nodeWGListeningPort = this.getNodeWGListeningPort(node_id);
                        endpoint = "";
                        if (accessNodes[node_id]["ipv4"]) {
                            endpoint = accessNodes[node_id]["ipv4"].split("/")[0] + ":" + nodeWGListeningPort;
                        }
                        else if (accessNodes[node_id]["ipv6"]) {
                            endpoint = "[" + accessNodes[node_id]["ipv6"].split("/")[0] + "]:" + nodeWGListeningPort;
                        }
                        else {
                            throw Error("Couldn't find ipv4 or ipv6 in the node " + node_id + " public config");
                        }
                        return [4 /*yield*/, this.getNodeWGPublicKey(node_id)];
                    case 2:
                        nodesWGPubkey = _a.sent();
                        return [4 /*yield*/, this.generateWireguardKeypair()];
                    case 3:
                        keypair = _a.sent();
                        accessPoint = new AccessPoint();
                        accessPoint.node_id = node_id;
                        accessPoint.subnet = this.getFreeSubnet();
                        accessPoint.wireguard_public_key = keypair.publicKey;
                        this.accessPoints.push(accessPoint);
                        return [4 /*yield*/, this.generatePeers()];
                    case 4:
                        _a.sent();
                        this.updateNetworkDeployments();
                        return [2 /*return*/, this.getWireguardConfig(accessPoint.subnet, keypair.privateKey, nodesWGPubkey, endpoint)];
                }
            });
        });
    };
    Network.prototype.addNode = function (node_id, metadata, description) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var keypair, znet, _a, znet_workload, node;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.nodeExists(node_id)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.generateWireguardKeypair()];
                    case 1:
                        keypair = _b.sent();
                        znet = new grid3_client_1.Znet();
                        znet.subnet = this.getFreeSubnet();
                        znet.ip_range = this.ipRange;
                        znet.wireguard_private_key = keypair.privateKey;
                        _a = znet;
                        return [4 /*yield*/, this.getFreePort(node_id)];
                    case 2:
                        _a.wireguard_listen_port = _b.sent();
                        znet["node_id"] = node_id;
                        this.networks.push(znet);
                        return [4 /*yield*/, this.generatePeers()];
                    case 3:
                        _b.sent();
                        this.updateNetworkDeployments();
                        znet = this.updateNetwork(znet);
                        znet_workload = new grid3_client_1.Workload();
                        znet_workload.version = 0;
                        znet_workload.name = this.name;
                        znet_workload.type = grid3_client_1.WorkloadTypes.network;
                        znet_workload.data = znet;
                        znet_workload.metadata = metadata;
                        znet_workload.description = description;
                        node = new Node();
                        node.node_id = node_id;
                        this.nodes.push(node);
                        return [2 /*return*/, znet_workload];
                }
            });
        });
    };
    Network.prototype.deleteNode = function (node_id) {
        var network;
        if (!this.exists()) {
            return 0;
        }
        var contract_id = 0;
        var nodes = [];
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.node_id !== node_id) {
                nodes.push(node);
            }
            else {
                contract_id = node.contract_id;
            }
        }
        this.nodes = nodes;
        this.networks = this.networks.filter(function (net) { return net["node_id"] !== node_id; });
        var net = this.networks.filter(function (net) { return net["node_id"] === node_id; });
        this.reservedSubnets = this.reservedSubnets.filter(function (subnet) { return subnet === net[0].subnet; });
        // if (nodes.length === 0) {
        //     this.delete()
        // }
        return contract_id;
    };
    Network.prototype.updateNetwork = function (znet) {
        for (var _i = 0, _a = this.networks; _i < _a.length; _i++) {
            var net = _a[_i];
            if (net.subnet === znet.subnet) {
                return net;
            }
        }
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
                    if (net.subnet === workload["data"]["subnet"]) {
                        workload["data"] = net;
                        break;
                    }
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
                        if (!deployments) return [3 /*break*/, 7];
                        rmbCL = new grid3_client_1.MessageBusClient();
                        _b = 0, _c = this.nodes;
                        _f.label = 1;
                    case 1:
                        if (!(_b < _c.length)) return [3 /*break*/, 5];
                        node = _c[_b];
                        return [4 /*yield*/, nodes_1.getNodeTwinId(node.node_id)];
                    case 2:
                        node_twin_id = _f.sent();
                        msg = rmbCL.prepare("zos.deployment.get", [node_twin_id], 0, 2);
                        rmbCL.send(msg, JSON.stringify({ "contract_id": node.contract_id }));
                        return [4 /*yield*/, rmbCL.read(msg)];
                    case 3:
                        result = _f.sent();
                        if (result[0].err) {
                            console.error("Could not load network deployment " + node.contract_id + " due to error: " + result[0].err + " ");
                        }
                        res = JSON.parse(result[0].dat);
                        res["node_id"] = node.node_id;
                        this.deployments.push(res);
                        for (_d = 0, _e = res["workloads"]; _d < _e.length; _d++) {
                            workload = _e[_d];
                            if (workload["type"] !== grid3_client_1.WorkloadTypes.network || !netaddr_1.Addr(this.ipRange).contains(netaddr_1.Addr(workload["data"]["subnet"]))) {
                                continue;
                            }
                            znet = this._fromObj(workload["data"]);
                            znet["node_id"] = node.node_id;
                            this.networks.push(znet);
                        }
                        _f.label = 4;
                    case 4:
                        _b++;
                        return [3 /*break*/, 1];
                    case 5: return [4 /*yield*/, this.getAccessPoints()];
                    case 6:
                        _f.sent();
                        _f.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Network.prototype._fromObj = function (net) {
        var znet = new grid3_client_1.Znet();
        Object.assign(znet, net);
        var peers = [];
        for (var _i = 0, _a = znet.peers; _i < _a.length; _i++) {
            var peer = _a[_i];
            var p = new grid3_client_1.Peer();
            Object.assign(p, peer);
            peers.push(p);
        }
        znet.peers = peers;
        return znet;
    };
    Network.prototype.exists = function () {
        return this.getNetworkNames().includes(this.name);
    };
    Network.prototype.nodeExists = function (node_id) {
        for (var _i = 0, _a = this.networks; _i < _a.length; _i++) {
            var net = _a[_i];
            if (net["node_id"] === node_id) {
                return true;
            }
        }
        return false;
    };
    Network.prototype.hasAccessPoint = function (node_id) {
        for (var _i = 0, _a = this.accessPoints; _i < _a.length; _i++) {
            var accessPoint = _a[_i];
            if (node_id === accessPoint.node_id) {
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
    Network.prototype.getNodeWGPublicKey = function (node_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, net;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.networks;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        net = _a[_i];
                        if (!(net["node_id"] == node_id)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getPublicKey(net.wireguard_private_key)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Network.prototype.getNodeWGListeningPort = function (node_id) {
        for (var _i = 0, _a = this.networks; _i < _a.length; _i++) {
            var net = _a[_i];
            if (net["node_id"] == node_id) {
                return net.wireguard_listen_port;
            }
        }
    };
    Network.prototype.getFreeIP = function (node_id, subnet) {
        if (subnet === void 0) { subnet = ""; }
        var ip;
        if (!this.nodeExists(node_id) && subnet) {
            ip = netaddr_1.Addr(subnet).mask(32).increment().increment();
        }
        else if (this.nodeExists(node_id)) {
            ip = netaddr_1.Addr(this.getNodeSubnet(node_id)).mask(32).increment().increment();
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
            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.node_id === node_id) {
                    node.reserved_ips.push(ip);
                    return ip;
                }
            }
            throw Error("node_id is not in the network. Please add it first");
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
        return [];
    };
    Network.prototype.deleteReservedIp = function (node_id, ip) {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.node_id === node_id) {
                node.reserved_ips = node.reserved_ips.filter(function (item) { return item !== ip; });
            }
        }
        return ip;
    };
    Network.prototype.getNodeSubnet = function (node_id) {
        for (var _i = 0, _a = this.networks; _i < _a.length; _i++) {
            var net = _a[_i];
            if (net["node_id"] === node_id) {
                return net.subnet;
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
        for (var _b = 0, _c = this.accessPoints; _b < _c.length; _b++) {
            var accessPoint = _c[_b];
            if (accessPoint.subnet && !this.reservedSubnets.includes(accessPoint.subnet)) {
                this.reservedSubnets.push(accessPoint.subnet);
            }
        }
        for (var _d = 0, _e = this.networks; _d < _e.length; _d++) {
            var network = _e[_d];
            if (!this.reservedSubnets.includes(network.subnet)) {
                this.reservedSubnets.push(network.subnet);
            }
        }
        return this.reservedSubnets;
    };
    Network.prototype.getFreeSubnet = function () {
        var reservedSubnets = this.getReservedSubnets();
        var subnet = netaddr_1.Addr(this.ipRange).mask(24).nextSibling().nextSibling();
        while (reservedSubnets.includes(subnet.toString())) {
            subnet = subnet.nextSibling();
        }
        this.reservedSubnets.push(subnet.toString());
        return subnet.toString();
    };
    Network.prototype.getAccessPoints = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodesWGPubkeys, _i, _a, network, pubkey, _b, _c, network, _d, _e, peer, accessPoint;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        nodesWGPubkeys = [];
                        _i = 0, _a = this.networks;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        network = _a[_i];
                        return [4 /*yield*/, this.getPublicKey(network.wireguard_private_key)];
                    case 2:
                        pubkey = _f.sent();
                        nodesWGPubkeys.push(pubkey);
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        for (_b = 0, _c = this.networks; _b < _c.length; _b++) {
                            network = _c[_b];
                            for (_d = 0, _e = network.peers; _d < _e.length; _d++) {
                                peer = _e[_d];
                                if (nodesWGPubkeys.includes(peer.wireguard_public_key)) {
                                    continue;
                                }
                                accessPoint = new AccessPoint();
                                accessPoint.subnet = peer.subnet;
                                accessPoint.wireguard_public_key = peer.wireguard_public_key;
                                accessPoint.node_id = network["node_id"];
                                this.accessPoints.push(accessPoint);
                            }
                        }
                        return [2 /*return*/, this.accessPoints];
                }
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
    Network.prototype.getFreePort = function (node_id) {
        return __awaiter(this, void 0, void 0, function () {
            var node_twin_id, rmbCL, msg, result, port;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nodes_1.getNodeTwinId(node_id)];
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
                            port = utils_1.getRandomNumber(2000, 8000);
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
                    case 0: return [4 /*yield*/, nodes_1.getNodeTwinId(node_id)];
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
                                if (iface !== "zos") {
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
        return "[Interface]\nAddress = " + userIP + "\nPrivateKey = " + userprivKey + "\n\n[Peer]\nPublicKey = " + peerPubkey + "\nAllowedIPs = " + this.ipRange + ", " + networkIP + "\nPersistentKeepalive = 25\nEndpoint = " + endpoint;
    };
    Network.prototype.save = function (contract_id, node_id) {
        if (contract_id === void 0) { contract_id = 0; }
        if (node_id === void 0) { node_id = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var network, nodes, _i, _a, node;
            return __generator(this, function (_b) {
                if (this.exists()) {
                    network = this.getNetworks()[this.name];
                }
                else {
                    network = {
                        "ip_range": this.ipRange,
                        "nodes": []
                    };
                }
                if (this.nodes.length === 0) {
                    this.delete();
                    return [2 /*return*/];
                }
                nodes = [];
                for (_i = 0, _a = this.nodes; _i < _a.length; _i++) {
                    node = _a[_i];
                    if (node.node_id === node_id) {
                        node.contract_id = contract_id;
                    }
                    if (!node.contract_id) {
                        continue;
                    }
                    nodes.push({
                        "contract_id": node.contract_id,
                        "node_id": node.node_id,
                        "reserved_ips": this.getNodeReservedIps(node.node_id),
                    });
                }
                network.nodes = nodes;
                this._save(network);
                return [2 /*return*/];
            });
        });
    };
    Network.prototype._save = function (network) {
        var networks = this.getNetworks();
        networks[this.name] = network;
        var path = PATH.join(jsonfs_1.appPath, "network.json");
        jsonfs_1.dumpToFile(path, networks);
    };
    Network.prototype.delete = function () {
        var networks = this.getNetworks();
        delete networks[this.name];
        var path = PATH.join(jsonfs_1.appPath, "network.json");
        jsonfs_1.dumpToFile(path, networks);
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
                        if (accessIP.includes(":")) {
                            accessIP = "[" + accessIP + "]";
                        }
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
