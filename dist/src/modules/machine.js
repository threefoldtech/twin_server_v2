"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.machine = void 0;
var disk_1 = require("../primitives/disk");
var expose_1 = require("../helpers/expose");
var Machine = /** @class */ (function () {
    function Machine() {
    }
    Machine.prototype.deploy = function (options) {
        // disks
        var disks;
        for (var i = 0; i < options.disks.length; i++) {
            var disk = new disk_1.Disk();
            // disk.create(options.disks[i].name, )
        }
    };
    __decorate([
        expose_1.expose
    ], Machine.prototype, "deploy", null);
    return Machine;
}());
exports.machine = Machine;
