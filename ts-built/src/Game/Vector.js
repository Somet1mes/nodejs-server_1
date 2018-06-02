"use strict";
/*

    Define a class for 3D vectors

*/
Object.defineProperty(exports, "__esModule", { value: true });
var Vector = /** @class */ (function () {
    function Vector(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    return Vector;
}());
exports.default = Vector;
