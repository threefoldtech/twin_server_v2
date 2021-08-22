"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.K8s = void 0;
var expose_1 = require("../helpers/expose");
var K8s = /** @class */ (function () {
    function K8s() {
    }
    K8s.prototype.deploy = function (options) {
        return "deployed";
    };
    __decorate([
        expose_1.expose
    ], K8s.prototype, "deploy", null);
    return K8s;
}());
exports.K8s = K8s;
