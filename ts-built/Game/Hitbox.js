"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*

This code is largely based on the Arcade2D physics code used in
the superpowers html5 gmae engine

http://superpowers-html5.com/index.en.html

Especialy since the client side runs the actual Arcade2D physics code
Unfortunatly i couldn't get that to work on the server
So i have to make my own now

*/
var Vector_1 = __importDefault(require("./Vector"));
var Hitbox = /** @class */ (function () {
    function Hitbox(x, y, width, height, offsetX, offsetY) {
        this.epsilon = 0.0001;
        this.position = new Vector_1.default();
        this.position.x = x || 0;
        this.position.y = y || 0;
        this.previousPosition = new Vector_1.default();
        this.previousPosition.x = 0;
        this.previousPosition.y = 0;
        this.width = width || 0;
        this.height = height || 0;
        this.bounce = new Vector_1.default();
        this.bounce.x = 0;
        this.bounce.y = 0;
        this.offset = new Vector_1.default();
        this.offset.x = offsetX || 0;
        this.offset.y = offsetY || 0;
        this.touches = { top: false, bottom: false, right: false, left: false }; //coppied
        this.velocity = new Vector_1.default();
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    Hitbox.prototype.setPosition = function (in_x, in_y) {
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
        this.position.x = in_x + this.offset.x;
        this.position.y = in_y + this.offset.y;
    };
    Hitbox.prototype.setVelocity = function (in_x, in_y) {
        this.velocity.x = in_x;
        this.velocity.y = in_y;
        if (isNaN(this.velocity.x))
            debugger;
    };
    Hitbox.prototype.right = function () {
        return this.position.x + this.width / 2;
    };
    Hitbox.prototype.left = function () {
        return this.position.x - this.width / 2;
    };
    Hitbox.prototype.top = function () {
        return this.position.y + this.height / 2;
    };
    Hitbox.prototype.bottom = function () {
        return this.position.y - this.height / 2;
    };
    Hitbox.prototype.deltaX = function () {
        return this.position.x - this.previousPosition.x;
    };
    Hitbox.prototype.deltaY = function () {
        return this.position.y - this.previousPosition.y;
    };
    Hitbox.prototype.move = function (period, gravityX, gravityY) {
        // Apply gravity
        this.velocity.y += gravityY * period;
        this.velocity.x += gravityX * period;
        // Store previousPosition
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
        // Update position
        this.position.x += this.velocity.x * period;
        this.position.y += this.velocity.y * period;
    };
    /**************************************

        Collisions

    ***************************************/
    Hitbox.prototype.collides = function (body1, body2) {
        if (body2 === void 0) { body2 = this; }
        // These will all get recalculated
        body1.touches.top = false;
        body1.touches.bottom = false;
        body1.touches.right = false;
        body1.touches.left = false;
        if (this.intersects(body1, body2)) // if the 2 bodies intersect
         {
            this.detachFromBox(body1, body2); //make it so they are no longer intersecting.
        }
    };
    Hitbox.prototype.intersects = function (body1, body2) {
        var intersecting = false;
        if (body1.right() < body2.right() && body1.right() > body2.left()) {
            if (body1.top() < body2.top() && body1.top() > body2.bottom()) {
                intersecting = true;
            }
        }
        return intersecting;
    };
    // Adapted from the Arcade2D physics code, as mentioned above
    Hitbox.prototype.detachFromBox = function (body1, body2) {
        // This function should only run when the boxes are intersecting
        // Hence we find which side the body is on
        // Then find how far inside they are
        var insideX = body1.position.x - body2.position.x;
        if (insideX >= 0)
            insideX -= (body1.width + body2.width) / 2;
        else
            insideX += (body1.width + body2.width) / 2;
        var insideY = body1.position.y - body2.position.y;
        if (insideY >= 0)
            insideY -= (body1.height + body2.height) / 2;
        else
            insideY += (body1.height + body2.height) / 2;
        if (Math.abs(insideY) <= Math.abs(insideX)) {
            if (body1.deltaY() / insideY > 0) {
                body1.velocity.y = -body1.velocity.y * body1.bounce.y;
                body1.position.y -= insideY;
            }
            if (body1.position.y > body2.position.y)
                body1.touches.bottom = true;
            else
                body1.touches.top = true;
        }
        else {
            if (body1.deltaX() / insideX > 0) {
                body1.velocity.x = -body1.velocity.x * body1.bounce.x;
                body1.position.x -= insideX;
            }
            if (body1.position.x > body2.position.x)
                body1.touches.left = true;
            else
                body1.touches.right = true;
        }
    };
    return Hitbox;
}());
exports.default = Hitbox;
