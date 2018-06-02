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
var Multiplayer_Behaviour = /** @class */ (function (_super) {
    __extends(Multiplayer_Behaviour, _super);
    function Multiplayer_Behaviour() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Multiplayer_Behaviour.prototype.awake = function () {
        this.actor.arcadeBody2D.setCustomGravity(0, 0);
    };
    Multiplayer_Behaviour.prototype.update = function () {
        //Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    };
    return Multiplayer_Behaviour;
}(Sup.Behavior));
Sup.registerBehavior(Multiplayer_Behaviour);
