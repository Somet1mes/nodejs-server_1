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
var Actor_ts_1 = __importDefault(require("../Actor.ts"));
var Key_ts_1 = __importDefault(require("./Key.ts"));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.playerID = -1;
        //Movement
        _this.moveSpeed = 0.1;
        _this.rollSpeed = 0.1;
        _this.jumpSpeed = 0.4;
        _this.rollDuration = 40;
        //Keys
        _this.key_Array = [];
        _this.key_LEFT = new Key_ts_1.default();
        _this.key_Array.push(_this.key_LEFT);
        _this.key_RIGHT = new Key_ts_1.default();
        _this.key_Array.push(_this.key_RIGHT);
        _this.key_UP = new Key_ts_1.default();
        _this.key_Array.push(_this.key_UP);
        _this.key_DOWN = new Key_ts_1.default();
        _this.key_Array.push(_this.key_DOWN);
        return _this;
    }
    return Player;
}(Actor_ts_1.default));
exports.default = Player;
