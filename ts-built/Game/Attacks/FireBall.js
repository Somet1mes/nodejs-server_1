"use strict";
/*
    The FireBall attack
*/
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
var Attacks_1 = __importDefault(require("./Attacks"));
var FireBall = /** @class */ (function (_super) {
    __extends(FireBall, _super);
    function FireBall() {
        var _this = _super.call(this) || this;
        _this.duration = 1; //in s
        _this.timeRemaining = _this.duration;
        _this.speed = 10; //in pix/s
        _this.collidesTerrain = true;
        _this.hitbox.width = 1;
        _this.hitbox.height = 0.5;
        return _this;
    }
    return FireBall;
}(Attacks_1.default));
exports.default = FireBall;
