/*
    The FireBall attack
*/


import Attacks from "./Attacks"

export default class FireBall extends Attacks
{
    constructor()
    {
        super();
        this.duration = 1; //in s
        this.timeRemaining = this.duration;
        this.speed = 10; //in pix/s
        this.collidesTerrain = true;

        this.hitbox.width = 1;
        this.hitbox.height = 0.5;
    }
}