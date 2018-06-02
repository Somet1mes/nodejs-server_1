"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tilemap_1 = __importDefault(require("./Tilemap"));
var fs = require("fs");
var Game = /** @class */ (function () {
    function Game(period, mapPath, setPath) {
        this.gravityY = -72; // in pixels/(s^2)
        this.gravityX = 0;
        this.period = period;
        var d = new Date();
        this.prevTime = d.getTime();
        this.curTime = d.getTime();
        // playerArray will contain all the players in the current "map" where each player is indexed by their playerID
        this.playerArray = [];
        this.assetTileMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
        this.assetTileSet = JSON.parse(fs.readFileSync(setPath, 'utf8'));
        this.tileMap = new Tilemap_1.default(this.assetTileMap, this.assetTileSet);
        this.collisionArray = [];
        this.terrain = [];
        // 0 is special index for terrain to hold the tilemap
        this.terrain[0] = this.tileMap;
        this.enemies = [];
        this.players = [];
        this.attacks = [];
        this.delayedKeysPress = [];
        this.delayedKeysRel = [];
    }
    Game.prototype.addPlayer = function (playerid, player) {
        this.playerArray[playerid] = player;
        this.players.push(player);
    };
    Game.prototype.addEnemy = function (enemy) {
        this.enemies.push(enemy);
    };
    Game.prototype.addAttack = function (attack) {
        this.attacks.push(attack);
    };
    // This should run every tick/frame/whatever
    Game.prototype.update = function () {
        //get the actual period the server is currently running at
        var d = new Date();
        this.curTime = d.getTime();
        this.period = (this.curTime - this.prevTime) / 1000; // Convert to s from ms
        this.prevTime = this.curTime;
        if (this.period > 0.05)
            console.log(this.period);
        //this.collisions();
        for (var i = this.playerArray.length - 1; i >= 0; i--) {
            // Since the array can have empty elements we need to check this
            if (this.playerArray[i] != undefined) {
                this.updatePlayer(this.playerArray[i]);
            }
        }
        for (var ii = 0; ii < this.delayedKeysPress.length; ii++) {
            this.onKeyPress(this.delayedKeysPress[ii].playerid, this.delayedKeysPress[ii].input, this.delayedKeysPress[ii].time);
            this.delayedKeysPress.splice(ii, 1);
            //console.log(this.delayedKeysPress);
        }
        for (var iii = 0; iii < this.delayedKeysRel.length; iii++) {
            this.onKeyRelease(this.delayedKeysRel[iii].playerid, this.delayedKeysRel[iii].input, this.delayedKeysRel[iii].time);
            this.delayedKeysRel.splice(iii, 1);
        }
        // Update All enemies and attacks
        for (var j = 0; j < this.attacks.length; j++) {
            this.attacks[j].update(this.period, this.terrain);
        }
        for (var jj = 0; jj < this.enemies.length; jj++) {
            this.enemies[jj].update(this.period, this.terrain);
        }
    };
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
        player.update(this.terrain, this.attacks, this.period);
        //this.playerMovements(player);
        player.hitbox.move(this.period, this.gravityX, this.gravityY);
        player.x = player.hitbox.position.x - player.hitbox.offset.x;
        player.y = player.hitbox.position.y - player.hitbox.offset.y;
        // Update hitbox position NOPE: the hitbox needs to control the player position and velocity
        //player.hitbox.setPosition(player.x, player.y);
        //player.hitbox.setVelocity(player.velocityX, player.velocityY);
    };
    Game.prototype.onKeyPress = function (playerid, input, time) {
        if (this.curTime - time < this.playerArray[playerid].fixedServerDelay - this.period) {
            this.delayedKeysPress.push({ playerid: playerid, input: input, time: time });
        }
        else {
            switch (input) {
                case "UP":
                    this.playerArray[playerid].key_UP.active = true;
                    break;
                case "DOWN":
                    this.playerArray[playerid].key_DOWN.active = true;
                    break;
                case "LEFT":
                    this.playerArray[playerid].key_LEFT.active = true;
                    break;
                case "RIGHT":
                    this.playerArray[playerid].key_RIGHT.active = true;
                    break;
                case "JUMP":
                    this.playerArray[playerid].key_JUMP.active = true;
                    break;
                case "Q":
                    this.playerArray[playerid].key_Q.active = true;
                    break;
                default:
                    console.log("Unrecognised key Press");
                    break;
            }
        }
    };
    Game.prototype.onKeyRelease = function (playerid, input, time) {
        if (this.curTime - time < this.playerArray[playerid].fixedServerDelay - this.period) {
            this.delayedKeysRel.push({ playerid: playerid, input: input, time: time });
        }
        else {
            switch (input) {
                case "UP":
                    this.playerArray[playerid].key_UP.active = false;
                    break;
                case "DOWN":
                    this.playerArray[playerid].key_DOWN.active = false;
                    break;
                case "LEFT":
                    this.playerArray[playerid].key_LEFT.active = false;
                    break;
                case "RIGHT":
                    this.playerArray[playerid].key_RIGHT.active = false;
                    break;
                case "JUMP":
                    this.playerArray[playerid].key_JUMP.active = false;
                    break;
                case "Q":
                    this.playerArray[playerid].key_Q.active = false;
                    break;
                default:
                    console.log("Unrecognised key Release", input);
                    break;
            }
        }
    };
    Game.prototype.onAction = function (playerid, action, time) {
    };
    Game.prototype.playerMovements = function (player) {
    };
    Game.prototype.collisions = function () {
        for (var i = 0; i < this.playerArray.length; i++) {
            // Since the array can have empty elements we need to check this
            if (this.playerArray[i] != undefined) {
                // Collide with collidables
                for (var j = this.collisionArray.length - 1; j >= 0; j--) {
                    if (this.collisionArray[j] != undefined) {
                        // checks for collisions of player.hitbox agains the hitbox body
                        this.playerArray[i].hitbox.collides(this.collisionArray[j]);
                    }
                }
                // Collide with the tileMap
                //console.log(this.playerArray[i].hitbox);
                this.tileMap.collides(this.playerArray[i].hitbox);
                //console.log(this.playerArray[i].hitbox);
            }
        }
    };
    return Game;
}());
exports.default = Game;
