"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Key = /** @class */ (function () {
    function Key() {
        this.active = false;
        this.wasJustPressed = false;
        this.wasJustReleased = false;
        this.prev = false; //false = up true = down
    }
    return Key;
}());
exports.default = Key;
