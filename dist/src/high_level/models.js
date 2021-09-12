"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operations = exports.TwinDeployment = void 0;
var Operations;
(function (Operations) {
    Operations["deploy"] = "deploy";
    Operations["update"] = "update";
})(Operations || (Operations = {}));
exports.Operations = Operations;
var TwinDeployment = /** @class */ (function () {
    function TwinDeployment(deployment, operation, publicIps, nodeId) {
        this.deployment = deployment;
        this.operation = operation;
        this.publicIps = publicIps;
        this.nodeId = nodeId;
        this.deployment = deployment;
        this.operation = operation;
        this.publicIps = publicIps;
        this.nodeId = nodeId;
    }
    return TwinDeployment;
}());
exports.TwinDeployment = TwinDeployment;
