"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwinDelete = exports.TwinList = exports.TwinGet = exports.TwinCreate = exports.ContractCancel = exports.ContractUpdate = exports.ContractGet = exports.ContractCreate = exports.DeleteZDB = exports.AddZDB = exports.ZDBS = exports.K8S = exports.Machines = void 0;
var Disks = /** @class */ (function () {
    function Disks() {
    }
    return Disks;
}());
var Network = /** @class */ (function () {
    function Network() {
    }
    return Network;
}());
var KubernetesNode = /** @class */ (function () {
    function KubernetesNode() {
    }
    return KubernetesNode;
}());
var Machines = /** @class */ (function () {
    function Machines() {
    }
    return Machines;
}());
exports.Machines = Machines;
var K8S = /** @class */ (function () {
    function K8S() {
    }
    return K8S;
}());
exports.K8S = K8S;
var ZDB = /** @class */ (function () {
    function ZDB() {
    }
    return ZDB;
}());
var ZDBS = /** @class */ (function () {
    function ZDBS() {
    }
    return ZDBS;
}());
exports.ZDBS = ZDBS;
var AddZDB = /** @class */ (function (_super) {
    __extends(AddZDB, _super);
    function AddZDB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AddZDB;
}(ZDB));
exports.AddZDB = AddZDB;
var DeleteZDB = /** @class */ (function () {
    function DeleteZDB() {
    }
    return DeleteZDB;
}());
exports.DeleteZDB = DeleteZDB;
var ContractCreate = /** @class */ (function () {
    function ContractCreate() {
    }
    return ContractCreate;
}());
exports.ContractCreate = ContractCreate;
var ContractGet = /** @class */ (function () {
    function ContractGet() {
    }
    return ContractGet;
}());
exports.ContractGet = ContractGet;
var ContractUpdate = /** @class */ (function () {
    function ContractUpdate() {
    }
    return ContractUpdate;
}());
exports.ContractUpdate = ContractUpdate;
var ContractCancel = /** @class */ (function () {
    function ContractCancel() {
    }
    return ContractCancel;
}());
exports.ContractCancel = ContractCancel;
var TwinCreate = /** @class */ (function () {
    function TwinCreate() {
    }
    return TwinCreate;
}());
exports.TwinCreate = TwinCreate;
var TwinGet = /** @class */ (function () {
    function TwinGet() {
    }
    return TwinGet;
}());
exports.TwinGet = TwinGet;
var TwinList = /** @class */ (function () {
    function TwinList() {
    }
    return TwinList;
}());
exports.TwinList = TwinList;
var TwinDelete = /** @class */ (function () {
    function TwinDelete() {
    }
    return TwinDelete;
}());
exports.TwinDelete = TwinDelete;
