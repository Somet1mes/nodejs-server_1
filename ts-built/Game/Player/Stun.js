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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Status_Effect_1 = __importDefault(require("./Status_Effect"));
var Stun = /** @class */ (function (_super) {
    __extends(Stun, _super);
    function Stun() {
        var _this = _super.call(this) || this;
        _this.setStatusName("Stun");
        _this.setCanAction(false);
        _this.setCanAttack(false);
        _this.setCanMove(false);
        _this.setActive(false);
        _this.setTimeRemaining(0);
        return _this;
    }
    return Stun;
}(Status_Effect_1.default));
exports.default = Stun;
