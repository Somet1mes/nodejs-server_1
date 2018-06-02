import Actor from "../Actor"
import Key from "./Key"
import Roll from "./Roll"
import Stun from "./Stun"
import Vector from "../Vector"
import FireBall from "../Attacks/FireBall"
import ActionClass from "./ActionClass"

export default class Player extends Actor
{

    public playerID: number;
    public moveSpeed: number;
    public rollSpeed: number;
    public jumpSpeed: number;
    public rollDuration: number;
    public rollStatus: Roll;
    public stunStatus: Stun;
    public key_Array;
    public key_LEFT: Key;
    public key_RIGHT: Key;
    public key_UP: Key;
    public key_DOWN: Key;
    public key_JUMP: Key;
    public key_Q: Key;
    public action: ActionClass;

    // If the latency between client and server is lower than this number then it is artificially increased
    // to this number, this means higher latency but more stable latency and so less desync
    public fixedServerDelay;

    constructor(x?, y?)
    {
        super(x, y);
        this.playerID = -1;


        //hitbox
        this.hitbox.width = 0.8;
        this.hitbox.height = 1.5;
        this.hitbox.offset.x = 0.05;
        this.hitbox.offset.y = -0.2;

        //Movement
        this.moveSpeed = 6;
        this.rollSpeed = 6;
        this.jumpSpeed = 24;
        this.rollDuration = 0.7;

        // Status effects
        this.rollStatus = new Roll();
        this.stunStatus = new Stun();

        //Keys
        this.key_Array = []
        this.key_LEFT = new Key();
        this.key_Array.push(this.key_LEFT);
        this.key_RIGHT = new Key();
        this.key_Array.push(this.key_RIGHT);
        this.key_UP = new Key();
        this.key_Array.push(this.key_UP);
        this.key_DOWN = new Key();
        this.key_Array.push(this.key_DOWN);
        this.key_JUMP = new Key();
        this.key_Array.push(this.key_JUMP);
        this.key_Q = new Key();
        this.key_Array.push(this.key_Q);
        // sorta related to keys
        this.fixedServerDelay = 0;


        // actions
        this.action = new ActionClass();
    }

    update(terrain, attacks, period)
    {
        this.collisions(terrain);
        this.checkAvaliableActions(attacks);
        this.attackCollisions(attacks);
        this.updateStatus(period);
    }

    collisions(terrain)
    {
        let basicCol = terrain
        for (var i = 0; i < basicCol.length; i++)
        {
            if (i === 0)
            {
                terrain[0].collides(this.hitbox); //terrain[0] is the tilemap
            }
            else
            {
                this.hitbox.collides(basicCol[i].hitbox);
            }
        }
    }

    attackCollisions(attacks)
    {
        for (let i = 0; i < attacks.length; i++)
        {
            if (attacks[i].creatorID != this.playerID) //don't hurt your creator
            {
                if (this.hitbox.collides(attacks[i].hitbox))
                {
                    attacks.onCollision();
                }
            }
        }
    }

    checkAvaliableActions(attacks)
    {
        if(this.stunStatus.getActive() === false)
        {
            if(this.rollStatus.getActive() === false)
            {
                this.movement();
                this.actions(attacks);
            }
       }
    }

    movement()
    {
        // Collisions should be called before this function
        let vel = new Vector(this.hitbox.velocity.x, this.hitbox.velocity.y);

        if (this.rollStatus.getActive() === false)
          {
            //check velocity so this cant roll while in the air
            if (this.key_LEFT.active && this.key_DOWN.wasJustPressed && vel.y === 0) //roll to the left
              {
                vel.x = -this.rollSpeed; //set the velocity 
                this.horzFlip = true;
                this.animation = "Roll";
                this.rollStatus.setTimeRemaining(this.rollDuration); //Setting the duration sets the effect to active


                
              }
            else if (this.key_RIGHT.active && this.key_DOWN.wasJustPressed && vel.y === 0)
              {
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
              

              
            } else if (this.key_RIGHT.active) {
              vel.x = this.moveSpeed;
              // When going right, we clear the flip
              this.horzFlip = false;
              this.animation = "Run";

            } else vel.x = 0;

            // If the this is on the ground and wants to jump,
            // we update the `.y` component accordingly
            let touchBottom = this.hitbox.touches.bottom;
            if (touchBottom) 
            {
              if (this.key_JUMP.wasJustPressed) 
              {
                vel.y = this.jumpSpeed;
                this.animation = "Jump";

              } 
              else 
              {
                // Here, we should play either "Idle" or "Run" depending on the horizontal speed
                if (vel.x === 0) this.animation = "Idle"
                //else this.animation
              }
            } 
            else 
            {
              // Here, we should play either "Jump" or "Fall" depending on the vertical speed
              if (vel.y >= 0) this.animation = "Jump";
              else this.animation = "Fall"
            }
          }

        // Aplly the velocity back to the hitbox
        this.hitbox.setVelocity(vel.x, vel.y);
    }

    actions(attacks)
    {

        this.action.type = "none";
        let isAttacking = false;
        if (this.key_Q.wasJustPressed)
        {
            var attack = new FireBall();
            attack.hitbox.setPosition(this.x, this.y);
            isAttacking = true;
            attacks.push(attack);
            this.action.type = "FireBall";
        }
        
        // Calculate the attack direction
        if (isAttacking)
        {
            let velocity = this.hitbox.velocity;
            attack.creatorID = this.playerID;
                
            if (this.key_DOWN.active)
            {
                attack.hitbox.velocity.y = -attack.speed + velocity.y;
                this.action.dir = "DOWN";
            }
            else if(this.key_UP.active)
            {
                attack.hitbox.velocity.y = attack.speed + velocity.y;
                this.action.dir = "UP";
            }
            else
            {
                if (this.horzFlip === true)
                {
                    attack.hitbox.velocity.x = -attack.speed + velocity.x;
                    attack.horzFlip = true;
                    this.action.dir = "LEFT";
                }
                else
                {
                    attack.hitbox.velocity.x = attack.speed + velocity.x;
                    attack.horzFlip = false;
                    this.action.dir = "RIGHT";
                }
            }
        }
    
    }

    /*************************************************************************
    * Purpose: Update the current status and the timers for each status in the status list
    **************************************************************************/
    updateStatus(period)
    {
        if(this.rollStatus.getTimeRemaining() > 0)
        {
          this.rollStatus.tick(period);
          //console.log(this.rollStatus.getTimeRemaining());
        }
    }
}