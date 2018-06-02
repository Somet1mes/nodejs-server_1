"use strict";
/*
  class as a base for all attacks
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Hitbox_1 = __importDefault(require("../Hitbox"));
var Attacks = /** @class */ (function () {
    function Attacks() {
        this.duration = 0;
        this.timeRemaining = 0;
        this.speed = 0; //The maximum scalar speed in pixels/s
        this.creatorID = 0;
        this.targetsPlayer = false;
        this.targetsEnemy = false;
        this.collidesTerrain = false;
        this.dying = false;
        this.horzFlip = false;
        this.hitbox = new Hitbox_1.default();
    }
    Attacks.prototype.update = function (period, terrain) {
        this.collisions(terrain);
        this.move(period);
        this.tick(period);
    };
    Attacks.prototype.collisions = function (terrain) {
        if (this.collidesTerrain) {
            for (var i = 0; i < terrain.length; i++) {
                if (i === 0) //0 index for terrain means the tilemap
                 {
                    if (terrain[i].collides(this.hitbox)) {
                        this.onCollision();
                    }
                }
                else if (this.hitbox.collides(terrain[i].hitbox)) {
                    this.onCollision();
                }
            }
        }
    };
    Attacks.prototype.onCollision = function () {
        // Destroy the attack (play the attack collision animation)
        this.destroy();
    };
    Attacks.prototype.move = function (period) {
        this.hitbox.move(period, 0, 0); //attacks arn't effected by gravity
        //if a specific attack does need to move differently then either the hitbox.velocity
        // can be updated in a seperate function or this function can be overwriten
    };
    Attacks.prototype.tick = function (period) {
        this.timeRemaining = this.timeRemaining - period;
        if (this.timeRemaining <= 0) {
            this.onCollision();
        }
    };
    Attacks.prototype.getRange = function () {
        return this.duration * this.speed;
    };
    Attacks.prototype.destroy = function () {
    };
    return Attacks;
}());
exports.default = Attacks;
