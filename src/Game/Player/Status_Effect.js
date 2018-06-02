"use strict";
var Status_Effect = (function () {
    // Constructors
    /*************************************************
    * Constructor
    **************************************************/
    function Status_Effect(inStatusName, inTimeRemaining) {
        this.setStatusName(inStatusName || "none");
        this.timeRemaining = inTimeRemaining || -1;
    }
    //Accessors
    Status_Effect.prototype.getStatusName = function () {
        return this.statusName;
    };
    Status_Effect.prototype.getCanAction = function () {
        return this.canAction;
    };
    Status_Effect.prototype.getCanAttack = function () {
        return this.canAttack;
    };
    Status_Effect.prototype.getCanMove = function () {
        return this.canMove;
    };
    Status_Effect.prototype.getActive = function () {
        return this.active;
    };
    Status_Effect.prototype.getTimeRemaining = function () {
        return this.timeRemaining;
    };
    //Mutators
    Status_Effect.prototype.setTimeRemaining = function (inTimeRemaining) {
        //console.log(inTimeRemaining + " " + this.timeRemaining);
        if (this.timeRemaining < inTimeRemaining) {
            this.timeRemaining = inTimeRemaining;
        }
        if (this.timeRemaining > 0) {
            this.active = true;
        }
        else {
            this.active = false;
        }
    };
    Status_Effect.prototype.setActive = function (inActive) {
        this.active = inActive;
    };
    Status_Effect.prototype.setStatusName = function (inStatus) {
        this.statusName = inStatus;
    };
    Status_Effect.prototype.setCanAction = function (inValue) {
        this.canAction = inValue;
    };
    Status_Effect.prototype.setCanAttack = function (inValue) {
        this.canAttack = inValue;
    };
    Status_Effect.prototype.setCanMove = function (inValue) {
        this.canMove = inValue;
    };
    //checks if status is still active 
    Status_Effect.prototype.tick = function () {
        this.timeRemaining--;
        if (this.timeRemaining <= 0) {
            this.active = false;
        }
    };
    return Status_Effect;
})();
exports.__esModule = true;
exports["default"] = Status_Effect;
;
