"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentFactory = void 0;
var grid3_client_1 = require("grid3_client");
var config_json_1 = __importDefault(require("../../config.json"));
var DeploymentFactory = /** @class */ (function () {
    function DeploymentFactory() {
    }
    DeploymentFactory.prototype.create = function (workloads, expiration, metadata, description, version) {
        if (metadata === void 0) { metadata = ""; }
        if (description === void 0) { description = ""; }
        if (version === void 0) { version = 0; }
        var signature_request = new grid3_client_1.SignatureRequest();
        signature_request.twin_id = config_json_1.default.twin_id;
        signature_request.weight = 1;
        var signature_requirement = new grid3_client_1.SignatureRequirement();
        signature_requirement.weight_required = 1;
        signature_requirement.requests = [signature_request];
        var deployment = new grid3_client_1.Deployment();
        deployment.version = 0;
        deployment.metadata = metadata;
        deployment.description = description;
        deployment.twin_id = config_json_1.default.twin_id;
        deployment.expiration = expiration;
        deployment.workloads = workloads;
        deployment.signature_requirement = signature_requirement;
        var hash = deployment.challenge_hash();
        deployment.sign(config_json_1.default.twin_id, config_json_1.default.mnemonic);
        return [deployment, hash];
    };
    return DeploymentFactory;
}());
exports.DeploymentFactory = DeploymentFactory;
