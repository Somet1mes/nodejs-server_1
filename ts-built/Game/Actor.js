"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Hitbox_1 = __importDefault(require("./Hitbox"));
var Actor = /** @class */ (function () {
    function Actor(x, y) {
        // Stats
        this.HP = 0;
        this.mana = 0;
        this.agility = 0;
        this.defence = 0;
        this.AP = 0;
        this.AD = 0;
        //Sprite + Animation
        this.animation = "Idle";
        this.horzFlip = false;
        // Not actual stats
        this.velocityX = 0;
        this.velocityY = 0;
        this.x = x || 0;
        this.y = y || 0;
        this.direction = "left";
        // Hit box
        this.hitbox = new Hitbox_1.default(1, 1, 1, 1);
        this.hitbox.position.x = this.x;
        this.hitbox.position.y = this.y;
    }
    return Actor;
}());
exports.default = Actor;
