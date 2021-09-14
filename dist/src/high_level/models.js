"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operations = exports.TwinDeployment = void 0;
var Operations;
(function (Operations) {
    Operations["deploy"] = "deploy";
    Operations["update"] = "update";
    Operations["delete"] = "delete";
})(Operations || (Operations = {}));
exports.Operations = Operations;
var TwinDeployment = /** @class */ (function () {
    function TwinDeployment(deployment, operation, publicIps, nodeId, network) {
        if (network === void 0) { network = null; }
        this.deployment = deployment;
        this.operation = operation;
        this.publicIps = publicIps;
        this.nodeId = nodeId;
        this.network = network;
        this.deployment = deployment;
        this.operation = operation;
        this.publicIps = publicIps;
        this.nodeId = nodeId;
        this.network = network;
    }
    return TwinDeployment;
}());
exports.TwinDeployment = TwinDeployment;
