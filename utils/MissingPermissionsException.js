"use strict";
exports.__esModule = true;
exports.MissingPermissionsException = void 0;
var MissingPermissionsException = /** @class */ (function () {
    function MissingPermissionsException(permissions) {
        this.permissions = permissions;
        this.message = "Missing permissions:";
    }
    MissingPermissionsException.prototype.toString = function () {
        return "".concat(this.message, " ").concat(this.permissions.join(", "));
    };
    return MissingPermissionsException;
}());
exports.MissingPermissionsException = MissingPermissionsException;
