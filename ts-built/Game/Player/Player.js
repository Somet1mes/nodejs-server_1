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
var Actor_1 = __importDefault(require("../Actor"));
var Key_1 = __importDefault(require("./Key"));
var Roll_1 = __importDefault(require("./Roll"));
var Stun_1 = __importDefault(require("./Stun"));
var Vector_1 = __importDefault(require("../Vector"));
var FireBall_1 = __importDefault(require("../Attacks/FireBall"));
var ActionClass_1 = __importDefault(require("./ActionClass"));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.playerID = -1;
        //hitbox
        _this.hitbox.width = 0.8;
        _this.hitbox.height = 1.5;
        _this.hitbox.offset.x = 0.05;
        _this.hitbox.offset.y = -0.2;
        //Movement
        _this.moveSpeed = 6;
        _this.rollSpeed = 6;
        _this.jumpSpeed = 24;
        _this.rollDuration = 0.7;
        // Status effects
        _this.rollStatus = new Roll_1.default();
        _this.stunStatus = new Stun_1.default();
        //Keys
        _this.key_Array = [];
        _this.key_LEFT = new Key_1.default();
        _this.key_Array.push(_this.key_LEFT);
        _this.key_RIGHT = new Key_1.default();
        _this.key_Array.push(_this.key_RIGHT);
        _this.key_UP = new Key_1.default();
        _this.key_Array.push(_this.key_UP);
        _this.key_DOWN = new Key_1.default();
        _this.key_Array.push(_this.key_DOWN);
        _this.key_JUMP = new Key_1.default();
        _this.key_Array.push(_this.key_JUMP);
        _this.key_Q = new Key_1.default();
        _this.key_Array.push(_this.key_Q);
        // sorta related to keys
        _this.fixedServerDelay = 0;
        // actions
        _this.action = new ActionClass_1.default();
        return _this;
    }
    Player.prototype.update = function (terrain, attacks, period) {
        this.collisions(terrain);
        this.checkAvaliableActions(attacks);
        this.attackCollisions(attacks);
        this.updateStatus(period);
    };
    Player.prototype.collisions = function (terrain) {
        var basicCol = terrain;
        for (var i = 0; i < basicCol.length; i++) {
            if (i === 0) {
                terrain[0].collides(this.hitbox); //terrain[0] is the tilemap
            }
            else {
                this.hitbox.collides(basicCol[i].hitbox);
            }
        }
    };
    Player.prototype.attackCollisions = function (attacks) {
        for (var i = 0; i < attacks.length; i++) {
            if (attacks[i].creatorID != this.playerID) //don't hurt your creator
             {
                if (this.hitbox.collides(attacks[i].hitbox)) {
                    attacks.onCollision();
                }
            }
        }
    };
    Player.prototype.checkAvaliableActions = function (attacks) {
        if (this.stunStatus.getActive() === false) {
            if (this.rollStatus.getActive() === false) {
                this.movement();
                this.actions(attacks);
            }
        }
    };
    Player.prototype.movement = function () {
        // Collisions should be called before this function
        var vel = new Vector_1.default(this.hitbox.velocity.x, this.hitbox.velocity.y);
        if (this.rollStatus.getActive() === false) {
            //check velocity so this cant roll while in the air
            if (this.key_LEFT.active && this.key_DOWN.wasJustPressed && vel.y === 0) //roll to the left
             {
                vel.x = -this.rollSpeed; //set the velocity 
                this.horzFlip = true;
                this.animation = "Roll";
                this.rollStatus.setTimeRemaining(this.rollDuration); //Setting the duration sets the effect to active
            }
            else if (this.key_RIGHT.active && this.key_DOWN.wasJustPressed && vel.y === 0) {
                vel.x = this.rollSpeed;
                this.horzFlip = false;
                this.animation = "Roll";
                this.rollStatus.setTimeRemaining(this.rollDuration);
            }
            // We override the `.x` component based on the this's input
            else if (this.key_LEFT.active) {
                vel.x = -this.moveSpeed;
                // When going left, we flip the sprite
                this.horzFlip = true;
                this.animation = "Run";
            }
            else if (this.key_RIGHT.active) {
                vel.x = this.moveSpeed;
                // When going right, we clear the flip
                this.horzFlip = false;
                this.animation = "Run";
            }
            else
                vel.x = 0;
            // If the this is on the ground and wants to jump,
            // we update the `.y` component accordingly
            var touchBottom = this.hitbox.touches.bottom;
            if (touchBottom) {
                if (this.key_JUMP.wasJustPressed) {
                    vel.y = this.jumpSpeed;
                    this.animation = "Jump";
                }
                else {
                    // Here, we should play either "Idle" or "Run" depending on the horizontal speed
                    if (vel.x === 0)
                        this.animation = "Idle";
                    //else this.animation
                }
            }
            else {
                // Here, we should play either "Jump" or "Fall" depending on the vertical speed
                if (vel.y >= 0)
                    this.animation = "Jump";
                else
                    this.animation = "Fall";
            }
        }
        // Aplly the velocity back to the hitbox
        this.hitbox.setVelocity(vel.x, vel.y);
    };
    Player.prototype.actions = function (attacks) {
        this.action.type = "none";
        var isAttacking = false;
        if (this.key_Q.wasJustPressed) {
            var attack = new FireBall_1.default();
            attack.hitbox.setPosition(this.x, this.y);
            isAttacking = true;
            attacks.push(attack);
            this.action.type = "FireBall";
        }
        // Calculate the attack direction
        if (isAttacking) {
            var velocity = this.hitbox.velocity;
            attack.creatorID = this.playerID;
            if (this.key_DOWN.active) {
                attack.hitbox.velocity.y = -attack.speed + velocity.y;
                this.action.dir = "DOWN";
            }
            else if (this.key_UP.active) {
                attack.hitbox.velocity.y = attack.speed + velocity.y;
                this.action.dir = "UP";
            }
            else {
                if (this.horzFlip === true) {
                    attack.hitbox.velocity.x = -attack.speed + velocity.x;
                    attack.horzFlip = true;
                    this.action.dir = "LEFT";
                }
                else {
                    attack.hitbox.velocity.x = attack.speed + velocity.x;
                    attack.horzFlip = false;
                    this.action.dir = "RIGHT";
                }
            }
        }
    };
    /*************************************************************************
    * Purpose: Update the current status and the timers for each status in the status list
    **************************************************************************/
    Player.prototype.updateStatus = function (period) {
        if (this.rollStatus.getTimeRemaining() > 0) {
            this.rollStatus.tick(period);
            //console.log(this.rollStatus.getTimeRemaining());
        }
    };
    return Player;
}(Actor_1.default));
exports.default = Player;
