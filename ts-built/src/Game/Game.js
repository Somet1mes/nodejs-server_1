"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = /** @class */ (function () {
    function Game() {
        this.gravityY = 0;
        this.gravityX = 0;
    }
    Game.prototype.updatePlayer = function (player) {
        //Do key state changes
        for (var i = 0; i < player.key_Array.length; i++) {
            player.key_Array[i].wasJustPressed = false;
            player.key_Array[i].wasJustReleased = false;
            if (player.key_Array[i].prev !== player.key_Array[i].active) {
                if (player.key_Array[i].active === false) {
                    player.key_Array[i].wasJustReleased = true;
                }
                else {
                    player.key_Array[i].wasJustPressed = true;
                }
            }
            player.key_Array[i].prev = player.key_Array[i].active;
        }
        this.playerMovements(player);
        // Apply gravity
        player.velocityY += this.gravityY;
        player.velocityX += this.gravityX;
        // Update position
        player.x += player.velocityX;
        player.y += player.velocityY;
    };
    Game.prototype.onKeyPress = function (player, input) {
        switch (input) {
            case "UP":
                player.key_UP.active = true;
                break;
            case "DOWN":
                player.key_DOWN.active = true;
                break;
            case "LEFT":
                player.key_LEFT.active = true;
                break;
            case "RIGHT":
                player.key_RIGHT.active = true;
                break;
            default:
                console.log("Unrecognised key Release");
                break;
        }
    };
    Game.prototype.onKeyRelease = function (player, input) {
        switch (input) {
            case "UP":
                player.key_UP.active = false;
                break;
            case "DOWN":
                player.key_DOWN.active = false;
                break;
            case "LEFT":
                player.key_LEFT.active = false;
                break;
            case "RIGHT":
                player.key_RIGHT.active = false;
                break;
            default:
                console.log("Unrecognised key Release");
                break;
        }
    };
    Game.prototype.playerMovements = function (player) {
        if (player.rollStatus.getActive() === false) {
            //check velocity so player cant roll while in the air
            if (player.key_LEFT.active && player.key_DOWN.wasJustPressed && player.velocityY === 0) //roll to the left
             {
                player.velocityX = -player.rollSpeed; //set the velocity 
                player.horzFlip = true;
                player.animation = "Roll";
                player.rollStatus.setTimeRemaining(player.rollDuration); //Setting the duration sets the effect to active
            }
            else if (player.key_RIGHT.active && player.key_DOWN.wasJustPressed && player.velocityY === 0) {
                player.velocityX = player.rollSpeed;
                player.horzFlip = false;
                player.animation = "Roll";
                player.rollStatus.setTimeRemaining(player.rollDuration);
            }
            // We override the `.x` component based on the player's input
            else if (player.key_LEFT.active) {
                player.velocityX = -player.moveSpeed;
                // When going left, we flip the sprite
                player.horzFlip = true;
                player.animation = "Run";
            }
            else if (player.key_RIGTH.active) {
                player.velocityX = player.moveSpeed;
                // When going right, we clear the flip
                player.horzFlip = false;
                player.animation = "Run";
            }
            else
                player.velocityX = 0;
            // If the player is on the ground and wants to jump,
            // we update the `.y` component accordingly
            var touchBottom = player.actor.hitbox.getTouches().bottom;
            if (touchBottom) {
                if (player.key_UP.wasJustPressed) {
                    player.velocityY = player.jumpSpeed;
                    player.animation = "Jump";
                }
                else {
                    // Here, we should play either "Idle" or "Run" depending on the horizontal speed
                    if (player.velocityX === 0)
                        player.animation = "Idle";
                    //else player.animation
                }
            }
            else {
                // Here, we should play either "Jump" or "Fall" depending on the vertical speed
                if (player.velocityY >= 0)
                    player.animation = "Jump";
                else
                    player.animation = "Fall";
            }
        }
    };
    Game.prototype.move = function (player, dir) {
        switch (dir) {
            case "left":
                player.velocityX = -player.moveSpeed;
                player.direction = "left";
                break;
            case "right":
                player.velocityX = -player.moveSpeed;
                player.direction = "right";
                break;
            default:
                player.velocityX = 0;
                break;
        }
        player.animation = "run";
    };
    Game.prototype.jump = function (player) {
        player.velocityY = player.jumpSpeed;
        player.animation = "jump";
    };
    Game.prototype.roll = function (player, dir) {
        switch (dir) {
            case "left":
                player.velocityX = -player.rollSpeed;
                player.direction = "left";
                break;
            case "right":
                player.velocityX = player.rollSpeed;
                player.direction = "left";
                break;
        }
        player.animation = "roll";
    };
    return Game;
}());
exports.default = Game;
