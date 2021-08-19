"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RMBServer = require('grid3_client/rmb/server');
var expose_1 = require("./helpers/expose");
var modules = require("./modules");
var Server = /** @class */ (function () {
    function Server(port) {
        if (port === void 0) { port = 6379; }
        this.server = new RMBServer.MessageBusServer(port);
    }
    Server.prototype.register = function () {
        for (var _i = 0, _a = Object.getOwnPropertyNames(modules).filter(function (item) { return typeof modules[item] === 'function'; }); _i < _a.length; _i++) {
            var module_1 = _a[_i];
            var obj = new modules[module_1]();
            var props = Object.getPrototypeOf(obj);
            var names = Object.getOwnPropertyNames(props);
            for (var _b = 0, names_1 = names; _b < names_1.length; _b++) {
                var name_1 = names_1[_b];
                if (expose_1.isExposed(obj, name_1) == true) {
                    this.server.withHandler("twinserver." + module_1.toLocaleLowerCase() + "." + name_1, obj[name_1]);
                }
            }
        }
    };
    Server.prototype.run = function () {
        this.server.run();
    };
    return Server;
}());
var server = new Server();
server.register();
server.run();
