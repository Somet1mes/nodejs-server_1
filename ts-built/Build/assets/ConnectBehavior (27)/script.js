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
var ConnectBehavior = /** @class */ (function (_super) {
    __extends(ConnectBehavior, _super);
    function ConnectBehavior() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "subject1";
        _this.playerID = playerID;
        _this.playerObj = new Player_Obj();
        _this.serverURL = "http://127.0.0.1:8080";
        return _this;
    }
    ConnectBehavior.prototype.awake = function () {
        this.currentPlayerStack = [];
        var userPlayer = new Player_and_Actor_Obj();
        userPlayer.actor = Sup.appendScene("Player/pre")[0];
        this.userActor = userPlayer.actor;
        this.updatePlayerObj();
        userPlayer.actor = this.userActor;
        userPlayer.actor.setPosition(this.playerObj.x, this.playerObj.y);
        userPlayer.actor.spriteRenderer.setAnimation("Idle");
        userPlayer.playerID = this.playerID;
        this.currentPlayerStack.push(userPlayer);
        // Connect to the server 
        this.connectToServer();
        // Pass the socket onto the player behaviour
        this.userBehavior = this.userActor.getBehavior(PlayerBehavior);
        this.userBehavior.socket = this.socket;
    };
    ConnectBehavior.prototype.update = function () {
        //this.requestUpdateFromServer();
        //camera follow player
        //Make 
    };
    ConnectBehavior.prototype.updatePlayerObj = function () {
        this.playerObj.name = this.name;
        this.playerObj.playerID = this.playerID;
        this.playerObj.x = this.userActor.getX();
        this.playerObj.y = this.userActor.getY();
        this.playerObj.animation = this.userActor.spriteRenderer.getAnimation();
    };
    ConnectBehavior.prototype.sortPlayerStack = function () {
        this.currentPlayerStack.sort(function (a, b) {
            return a.playerID - b.playerID;
        });
    };
    /*********************************************************************************************************************88
    *
    *         Connection and Server functions
    *
    *************************************************************************************************************************/
    ConnectBehavior.prototype.connectToServer = function () {
        // This connects to the server at the given url
        this.socket = io(this.serverURL);
        // initialise the player on the server
        this.socket.emit('Initialise Player', this.playerID);
        console.log(this.socket);
        var _self = this;
        var count;
        this.socket.on('Update Players', function (playerStack) {
            //console.log(playerStack);
            count = 0;
            var tempPlayer = new Player_and_Actor_Obj();
            for (var i = 0; i < _self.currentPlayerStack.length; i++) {
                // Since the playerStack is sorted with lowest id at the start and highest at the end
                //if this occurs then there used to be a playerID in currentPlayerStack but it's no longer there
                //so it must have dissconected, in which case we need to remove it
                if (i >= playerStack.length) {
                    _self.currentPlayerStack[i].actor.destroy(); //destroy the player whos no longer here
                    _self.currentPlayerStack.splice(i, 1); //remove it from the array
                    console.log("Removed other player1");
                }
                else if (_self.currentPlayerStack[i].playerID < playerStack[i].playerID) {
                    _self.currentPlayerStack[i].actor.destroy(); //destroy the player whos no longer here
                    _self.currentPlayerStack.splice(i, 1); //remove it from the array
                    console.log("Removed other player2");
                }
                // This means there is a player in the servers playerStack not in ours, os we have to add it
                else if (_self.currentPlayerStack[i].playerID > playerStack[i].playerID) {
                    console.log("Try to add anothre player1");
                    tempPlayer.actor = Sup.appendScene("Multiplayer/Prefab")[0];
                    tempPlayer.actor.arcadeBody2D.warpPosition(playerStack[i].x, playerStack[i].y);
                    tempPlayer.actor.spriteRenderer.setAnimation(playerStack[i].animation);
                    tempPlayer.playerID = playerStack[i].playerID;
                    _self.currentPlayerStack.splice(i, 0, tempPlayer);
                    _self.sortPlayerStack();
                    console.log("Added other player1");
                }
                // This menas the player is still here and we need to update it's position etc
                else if (_self.currentPlayerStack[i].playerID === playerStack[i].playerID) {
                    if (_self.currentPlayerStack[i].playerID !== _self.playerID) {
                        _self.currentPlayerStack[i].actor.arcadeBody2D.warpPosition(playerStack[i].x, playerStack[i].y);
                        _self.currentPlayerStack[i].actor.spriteRenderer.setAnimation(playerStack[i].animation);
                        console.log("Updated other player");
                    }
                }
                count++;
            }
            if (count < playerStack.length) {
                for (var ii = count; ii < playerStack.length; ii++) {
                    console.log("try to add another player2");
                    tempPlayer.actor = Sup.appendScene("Multiplayer/Prefab")[0];
                    tempPlayer.actor.arcadeBody2D.warpPosition(playerStack[i].x, playerStack[i].y);
                    tempPlayer.actor.spriteRenderer.setAnimation(playerStack[i].animation);
                    tempPlayer.playerID = playerStack[i].playerID;
                    _self.currentPlayerStack.push(tempPlayer);
                    _self.sortPlayerStack();
                    console.log("Added other player2");
                    console.log(_self.currentPlayerStack);
                    console.log(playerStack);
                }
            }
        });
    };
    ConnectBehavior.prototype.requestUpdateFromServer = function () {
        this.updatePlayerObj();
        this.socket.emit('Request Players', this.playerObj);
    };
    return ConnectBehavior;
}(Sup.Behavior));
Sup.registerBehavior(ConnectBehavior);
