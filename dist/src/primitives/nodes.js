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
exports.getAccessNodes = exports.getNodeTwinId = void 0;
var isPrivateIP = require("private-ip");
var IP = require("ip");
var requests_1 = require("../helpers/requests");
var graphqlURL = "https://explorer.devnet.grid.tf/graphql/";
function getNodeTwinId(node_id) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, body, response, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { 'Content-Type': 'application/json' };
                    body = "{\n            nodes(where: { nodeId_eq: " + node_id + " }) {\n            twinId\n            }\n        }";
                    return [4 /*yield*/, requests_1.send("post", graphqlURL, JSON.stringify({ "query": body }), headers)];
                case 1:
                    response = _a.sent();
                    res = JSON.parse(response);
                    return [2 /*return*/, res["data"]["nodes"][0]["twinId"]];
            }
        });
    });
}
exports.getNodeTwinId = getNodeTwinId;
function getAccessNodes() {
    return __awaiter(this, void 0, void 0, function () {
        var headers, body, nodeResponse, nodeRes, nodes, nodeConfigs, configsIds, _i, nodes_1, node, pubConfigResponse, pubConfigRes, configs, accessNodes, _a, _b, nodeId, config, _c, configs_1, conf, ipv4, ipv6;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    headers = { 'Content-Type': 'application/json' };
                    body = "{\n        nodes {\n          nodeId\n          publicConfigId \n        }\n      }";
                    return [4 /*yield*/, requests_1.send("post", graphqlURL, JSON.stringify({ "query": body }), headers)];
                case 1:
                    nodeResponse = _d.sent();
                    nodeRes = JSON.parse(nodeResponse);
                    nodes = nodeRes["data"]["nodes"];
                    nodeConfigs = {};
                    configsIds = "";
                    for (_i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                        node = nodes_1[_i];
                        if (!node.publicConfigId) {
                            continue;
                        }
                        nodeConfigs[node.nodeId] = node.publicConfigId;
                        configsIds += "\"" + node.publicConfigId + "\", ";
                    }
                    body = "{\n        publicConfigs (where: {id_in: [" + configsIds + "]}) {\n          id\n          ipv4\n          ipv6    \n        }\n      }";
                    return [4 /*yield*/, requests_1.send("post", graphqlURL, JSON.stringify({ "query": body }), headers)];
                case 2:
                    pubConfigResponse = _d.sent();
                    pubConfigRes = JSON.parse(pubConfigResponse);
                    configs = pubConfigRes["data"]["publicConfigs"];
                    accessNodes = {};
                    for (_a = 0, _b = Object.keys(nodeConfigs); _a < _b.length; _a++) {
                        nodeId = _b[_a];
                        config = nodeConfigs[nodeId];
                        for (_c = 0, configs_1 = configs; _c < configs_1.length; _c++) {
                            conf = configs_1[_c];
                            if (config === conf["id"]) {
                                ipv4 = conf["ipv4"];
                                ipv6 = conf["ipv6"];
                                if ((IP.isV4Format(ipv4.split("/")[0]) && !isPrivateIP(ipv4)) || (IP.isV6Format(ipv6.split("/")[0]) && !isPrivateIP(ipv6))) {
                                    accessNodes[nodeId] = { "ipv4": ipv4, "ipv6": ipv6 };
                                }
                            }
                        }
                    }
                    console.log(accessNodes);
                    return [2 /*return*/, accessNodes];
            }
        });
    });
}
exports.getAccessNodes = getAccessNodes;
