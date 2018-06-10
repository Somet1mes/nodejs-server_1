Sup.ArcadePhysics2D.setGravity(0, 0);

class PlayerBehavior extends Sup.Behavior 
{
  playerStats = new Stat_Obj();
  
  
  //All speeds in pixels/s
  //All accelarations in pixels/(s^2)
  //All durations in s
  speed = 6;
  jumpSpeed = 24;
  rollSpeed = 6;
  rollDuration = 0.7;
  gravityX = 0;
  gravityY = -72;

  playerObj = new Player_Obj();
  //load status's for player
  rollStatus = new Roll();
  stunStatus = new Stun();
  
  key = new keyList();
  
  // The socket for the server
  socket;
  
  //time of the current update
  time;
  
   
  awake()
  {
    //this.actor.arcadeBody2D.setCustomGravity(0, -0.02);
    
    
  }

  update() 
  {
    this.time = new Date().getTime();
    this.collisions();
      if (HUD.inFocus === "Game")
          {
              this.sendInputs();
              this.checkAvaliableActions();
          }
    this.attackCollisions();
    this.updateStatus();
    if (Sup.Input.isKeyDown(this.key.correct))
      {
        this.correctPos();
      }
  }
  
  
  collisions()
  {
    let basicCol = Sup.getActor("terrain").getChildren();
    for (var i = 0; i < basicCol.length; i++)
      {
        Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, basicCol[i].arcadeBody2D);
      }
  }
  
  checkAvaliableActions()
  {
    if(this.stunStatus.getActive() === false)
       {
        if(this.rollStatus.getActive() === false)
        {
          this.movement();
          this.actions();
        }
       }
  }
  
  movement()
  {
    
    let fps = Sup.Game.getFPS();
    // As explained above, we get the current velocity
    // Convert the velocity into pxiels/s
    let velocity = this.actor.arcadeBody2D.getVelocity();
    velocity.x = velocity.x * fps;
    velocity.y = velocity.y * fps;
    
  //check player status
    if (this.rollStatus.getActive() === false)
      {
        //check velocity so player cant roll while in the air
        if (Sup.Input.isKeyDown(this.key.left) && Sup.Input.wasKeyJustPressed(this.key.down) && velocity.y === 0) //roll to the left
          {
            velocity.x = -this.rollSpeed; //set the velocity 
            this.actor.spriteRenderer.setHorizontalFlip(true);
            this.actor.spriteRenderer.setAnimation("Roll");
            this.rollStatus.setTimeRemaining(this.rollDuration); //Setting the duration sets the effect to active       
          }
        else if (Sup.Input.isKeyDown(this.key.right) && Sup.Input.wasKeyJustPressed(this.key.down) && velocity.y === 0)
          {
            velocity.x = this.rollSpeed;
            this.actor.spriteRenderer.setHorizontalFlip(false);
            this.actor.spriteRenderer.setAnimation("Roll");
            this.rollStatus.setTimeRemaining(this.rollDuration);
          }

          // We override the `.x` component based on the player's input
        else if (Sup.Input.isKeyDown(this.key.left)) {
          velocity.x = -this.speed;
          // When going left, we flip the sprite
          this.actor.spriteRenderer.setHorizontalFlip(true);
          this.actor.spriteRenderer.setAnimation("Run");
          
        } else if (Sup.Input.isKeyDown(this.key.right)) {
          velocity.x = this.speed;
          // When going right, we clear the flip
          this.actor.spriteRenderer.setHorizontalFlip(false);
          this.actor.spriteRenderer.setAnimation("Run");
        } else velocity.x = 0;

        // If the player is on the ground and wants to jump,
        // we update the `.y` component accordingly
        let touchBottom = this.actor.arcadeBody2D.getTouches().bottom;
        if (touchBottom) 
        {
          if (Sup.Input.wasKeyJustPressed(this.key.jump)) 
          {
            velocity.y = this.jumpSpeed;
            this.actor.spriteRenderer.setAnimation("Jump");
          } 
          else 
          {
            // Here, we should play either "Idle" or "Run" depending on the horizontal speed
            if (velocity.x === 0) this.actor.spriteRenderer.setAnimation("Idle");
            //else this.actor.spriteRenderer.setAnimation("Run");
          }
        } 
        else 
        {
          // Here, we should play either "Jump" or "Fall" depending on the vertical speed
          if (velocity.y >= 0) this.actor.spriteRenderer.setAnimation("Jump");
          else this.actor.spriteRenderer.setAnimation("Fall");
        }
      }
    // Finally, we apply the velocity back to the ArcadePhysics body
    // After we've altered the velocity to deal with frame rate independance
    velocity.x = velocity.x / fps;
    velocity.y = velocity.y / fps;
    let gravityPerTick = new Sup.Math.Vector2();
    gravityPerTick.x = this.gravityX / (fps**2);
    gravityPerTick.y = this.gravityY / (fps**2);
    this.actor.arcadeBody2D.setCustomGravity(gravityPerTick);
    this.actor.arcadeBody2D.setVelocity(velocity);
  }
  
  actions()
  {
    let isAttacking = false;
    if (Sup.Input.wasKeyJustPressed(this.key.q))
      {
        var attack = Sup.appendScene("Attacks/FireBall/Prefab")[0];
        // make it a child of targetsEnemy
        attack.setParent(Sup.getActor("attacks").getChild("targetsEnemy"))
        attack.arcadeBody2D.warpPosition(this.actor.getPosition());
        isAttacking = true;
      }
    
    // Calculate the attack direction
    if (isAttacking)
      {
        var behav = attack.getBehavior(AttacksBehavior);
        let fps = Sup.Game.getFPS();
        let velocity = this.actor.arcadeBody2D.getVelocity();
        behav.creatorID = Globals.getPlayerID();
            
        if (Sup.Input.isKeyDown(this.key.down))
          {
            behav.velocity.y = -behav.speed + velocity.y * fps;
            //These rotations are weird
            attack.setLocalEulerAngles(0,0,-Math.PI/2);
          }
        else if(Sup.Input.isKeyDown(this.key.up))
          {
            behav.velocity.y = behav.speed + velocity.y * fps;
            attack.setLocalEulerAngles(0,0,Math.PI/2);
          }
        else
          {
            if (this.actor.spriteRenderer.getHorizontalFlip() === true)
              {
                behav.velocity.x = -behav.speed + velocity.x * fps;
                attack.spriteRenderer.setHorizontalFlip(true);
              }
            else
            {
              behav.velocity.x = behav.speed + velocity.x * fps;
              attack.spriteRenderer.setHorizontalFlip(false);
            }
          }
      }
    
  }
  
  
  // This is only gonna work for a select few inputs as it should be more efficient to
  // send other things as actions instead of key presses (see sendAction())
  sendInputs()
  {
    for (var i = 0; i < this.key.keyList.length; i++)
      {
        if(Sup.Input.wasKeyJustPressed(this.key.keyList[i]))
          {
            let data = {key:this.key.keyCom[i], time:this.time}
            this.socket.emit("keyPress", data);
          }
        if(Sup.Input.wasKeyJustReleased(this.key.keyList[i]))
          {
            let data = {key:this.key.keyCom[i], time:this.time}
            this.socket.emit("keyRelease", data);
          }
      }
  }
  
  // For more complex things than the single key presses in the above
  sendAction(action)
  {
    let data = {action:action, time:this.time}
    this.socket.emit("action", data);
  }
  
  
  
  /*************************************************************************
  * Purpose: Update the current status and the timers for each status in the status list
  **************************************************************************/
  updateStatus()
  {
    if(this.rollStatus.getTimeRemaining() > 0)
    {
      this.rollStatus.tick(1/Sup.Game.getFPS());
      //console.log(this.rollStatus.getTimeRemaining());
    }
       
  }
  
  
  /**********************************************************************
  * Purpose: Correct the client sided player position to the server sided one
  * WHere the server sided one is kept in the server_clone
  ***********************************************************************/
  correctPos()
  {
    this.actor.arcadeBody2D.warpPosition(Globals.serverClone.getPosition());
  }
  
  /***********************************************************************
  * Purpose: check all collisions between this player and attacks
  ***********************************************************************/
  attackCollisions()
  {
    let attacks = Sup.getActor("attacks").getChild("targetsPlayer").getChildren();
    for (let i = 0; i < attacks.length; i++)
      {
        let behav = attacks[i].getBehavior(AttacksBehavior);
        if (behav.creatorID != Globals.getPlayerID())
          {
            if (Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, attacks[i].arcadeBody2D) === true)
            {
              behav.onCollision();
            }
          }
      }
  }
  
  
  
 
  
  
  
  
  
}
Sup.registerBehavior(PlayerBehavior);
