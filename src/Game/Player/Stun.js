var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Status_Effect_ts_1 = require("./Status_Effect.ts");
var Stun = (function (_super) {
    __extends(Stun, _super);
    function Stun() {
        _super.call(this);
        this.setStatusName("Stun");
        this.setCanAction(false);
        this.setCanAttack(false);
        this.setCanMove(false);
        this.setActive(false);
        this.setTimeRemaining(0);
    }
    return Stun;
})(Status_Effect_ts_1["default"]);
exports.__esModule = true;
exports["default"] = Stun;
