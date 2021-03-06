"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Roll = /** @class */ (function (_super) {
    __extends(Roll, _super);
    function Roll() {
        var _this = _super.call(this) || this;
        _this.setStatusName("Stun");
        _this.setCanAction(true);
        _this.setCanAttack(false);
        _this.setCanMove(false);
        _this.setActive(false);
        _this.setTimeRemaining(0);
        return _this;
    }
    return Roll;
}(Status_Effect));
