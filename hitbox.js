'use strict';

/*

This code is largely based on the Arcade2D physics code used in 
the superpowers html5 gmae engine

http://superpowers-html5.com/index.en.html

Especialy since the client side runs the actual Arcade2D physics code
Unfortunatly i couldn't get that to work on the server
So i have to make my own now

*/

const SupEngine = require('./Build/SupEngine.js');
var THREE = SupEngine.THREE

class Hitbox
{
	constructor(x, y, width, height, offsetX, offsetY)
	{
		this.position = new THREE.Vector3();
		this.position.x = x || 0;
		this.position.y = y || 0;
		this.previousPosition = new THREE.Vector3();
		this.previousPosition.x = 0;
		this.previousPosition.y = 0;
		this.width = width || 0;
		this.height = height || 0;
		this.bounceX = 0;
		this.bounceY = 0;
		this.offsetX = offsetX || 0;
		this.offsetY = offsetY || 0;
		this.touches = { top: false, bottom: false, right: false, left: false }; //coppied
		this.velocity = new THREE.Vector3();
		this.velocity.x = 0;
		this.velocity.y = 0;

		this.right = function () { return this.position.x + this.width / 2; };
	    this.left = function () { return this.position.x - this.width / 2; };
	    this.top = function () { return this.position.y + this.height / 2; };
	    this.bottom = function () { return this.position.y - this.height / 2; };
	    this.deltaX = function () { return this.position.x - this.previousPosition.x; };
	    this.deltaY = function () { return this.position.y - this.previousPosition.y; };
    return ArcadeBody2D;
	}

	collides(body1, body2)
	{
		// These will all get recalculated
		body1.touches.top = false;
        body1.touches.bottom = false;
        body1.touches.right = false;
        body1.touches.left = false;


		if(intersects(body1, body2)) // if the 2 bodies intersect
		{

			detachFromBox(body1, body2); //make it so they are no longer intersecting.
		}
	}

	intersects(body1, body2)
	{
		intersecting = false;

		if (body1.right() <= body2.right() && body1.right() >= body2.left())
		{
			if (body1.top() <= body2.top() && body1.top() >= body2.bottom())
			{
				intersecting = true;
			}
		}

		return intersecting;
	}

	// Adapted from the Arcade2D physics code, as mentioned above
	detachFromBox(body1, body2) 
	{
        var insideX = body1.position.x - body2.position.x;
        if (insideX >= 0)
            insideX -= (body1.width + body2.width) / 2;
        else
            insideX += (body1.width + body2.width) / 2;
        var insideY = body1.y - body2.y;
        if (insideY >= 0)
            insideY -= (body1.height + body2.height) / 2;
        else
            insideY += (body1.height + body2.height) / 2;
        if (Math.abs(insideY) <= Math.abs(insideX)) {
            if (body1.deltaY() / insideY > 0) {
                body1.velocity.y = -body1.velocity.y * body1.bounceY;
                body1.y -= insideY;
            }
            if (body1.y > body2.y)
                body1.touches.bottom = true;
            else
                body1.touches.top = true;
        }
        else {
            if (body1.deltaX() / insideX > 0) {
                body1.velocity.x = -body1.velocity.x * body1.bounceX;
                body1.position.x -= insideX;
            }
            if (body1.position.x > body2.position.x)
                body1.touches.left = true;
            else
                body1.touches.right = true;
        }
    }
}

module.exports = Hitbox