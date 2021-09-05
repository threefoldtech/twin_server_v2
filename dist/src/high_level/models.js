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
    function TwinDeployment(deployment, operation, publicIPs, nodeId) {
        this.deployment = deployment;
        this.operation = operation;
        this.publicIPs = publicIPs;
        this.nodeId = nodeId;
    }
    return TwinDeployment;
}());
exports.TwinDeployment = TwinDeployment;
