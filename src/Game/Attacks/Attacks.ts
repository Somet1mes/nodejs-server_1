/*
  class as a base for all attacks
*/

import Vector from "../Vector"
import Hitbox from "../Hitbox"

export default class Attacks 
{
  
    duration:number = 0;
    timeRemaining:number = 0;
    speed:number = 0; //The maximum scalar speed in pixels/s
    creatorID:number = 0;
    targetsPlayer:boolean = false;
    targetsEnemy:boolean = false;
    collidesTerrain:boolean = false;
    dying:boolean = false;

    horzFlip:boolean = false;

    hitbox:Hitbox;
      
    constructor()
    {
        this.hitbox = new Hitbox()
    }

      update(period, terrain) 
      {
        this.collisions(terrain);
        
        this.move(period);
        
        this.tick(period);
        
      }
      
    collisions(terrain)
    {
        if (this.collidesTerrain)
        {
            for (var i = 0; i < terrain.length; i++)
            {
                if (i === 0) //0 index for terrain means the tilemap
                {
                    if (terrain[i].collides(this.hitbox))
                    {
                        this.onCollision();
                    }
                }
                else if (this.hitbox.collides(terrain[i].hitbox))
                {
                    this.onCollision();
                }
            }
        }
    }
      
    onCollision()
    {
        // Destroy the attack (play the attack collision animation)
        this.destroy();
    }
      
    move(period)
    {
        this.hitbox.move(period, 0, 0); //attacks arn't effected by gravity
        //if a specific attack does need to move differently then either the hitbox.velocity
        // can be updated in a seperate function or this function can be overwriten
    }
      
    tick(period)
    {
        this.timeRemaining = this.timeRemaining - period;
        if(this.timeRemaining <= 0)
        {
            this.onCollision()
        }
    }
      
    getRange()
    {
        return this.duration * this.speed;
    }

    destroy()
    {

    }
  
}
