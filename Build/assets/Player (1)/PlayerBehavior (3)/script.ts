Sup.ArcadePhysics2D.setGravity(0, -0.02);

class PlayerBehavior extends Sup.Behavior 
{
  playerStats = new Stat_Obj();
  
  speed = 0.1;
  jumpSpeed = 0.4;
  rollSpeed = 0.1;
  rollDuration = 40;

  playerObj = new Player_Obj();
  //load status's for player
  rollStatus = new Roll();
  stunStatus = new Stun();
  
  // A list of keys to be tracked
  keyList = ["LEFT", "RIGHT", "UP", "DOWN"];
  
  // The socket for the server
  socket;
  
   
  awake()
  {
    
    
    
  }

  update() 
  {
    this.movementAndCollision();
    this.updateStatus();
    this.sendInputs();
  }
  
  
  checkAvaliableActions()
  {
    if(this.stunStatus.getActive() === false)
       {
        if(this.rollStatus.getActive() === false)
        {
          this.movementAndCollision();
        }
       }
    
  }
  
  movementAndCollision()
  {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());

    // As explained above, we get the current velocity
    let velocity = this.actor.arcadeBody2D.getVelocity();
    
  //check player status
    if (this.rollStatus.getActive() === false)
      {
        //check velocity so player cant roll while in the air
        if (Sup.Input.isKeyDown("LEFT") && Sup.Input.wasKeyJustPressed("DOWN") && velocity.y === 0) //roll to the left
          {
            velocity.x = -this.rollSpeed; //set the velocity 
            this.actor.spriteRenderer.setHorizontalFlip(true);
            this.actor.spriteRenderer.setAnimation("Roll");
            this.rollStatus.setTimeRemaining(this.rollDuration); //Setting the duration sets the effect to active
            // Send input to server
            this.socket.emit("Input", "rollLeft");

            
          }
        else if (Sup.Input.isKeyDown("RIGHT") && Sup.Input.wasKeyJustPressed("DOWN") && velocity.y === 0)
          {
            velocity.x = this.rollSpeed;
            this.actor.spriteRenderer.setHorizontalFlip(false);
            this.actor.spriteRenderer.setAnimation("Roll");
            this.rollStatus.setTimeRemaining(this.rollDuration);
            // Send input to server
            this.socket.emit("Input", "rollRight");
          }

          // We override the `.x` component based on the player's input
        else if (Sup.Input.isKeyDown("LEFT")) {
          velocity.x = -this.speed;
          // When going left, we flip the sprite
          this.actor.spriteRenderer.setHorizontalFlip(true);
          this.actor.spriteRenderer.setAnimation("Run");
          
          // Send input to server
          this.socket.emit("Input", "moveLeft");
          
        } else if (Sup.Input.isKeyDown("RIGHT")) {
          velocity.x = this.speed;
          // When going right, we clear the flip
          this.actor.spriteRenderer.setHorizontalFlip(false);
          this.actor.spriteRenderer.setAnimation("Run");
          // Send input to server
          this.socket.emit("Input", "moveRight");
        } else velocity.x = 0;

        // If the player is on the ground and wants to jump,
        // we update the `.y` component accordingly
        let touchBottom = this.actor.arcadeBody2D.getTouches().bottom;
        if (touchBottom) 
        {
          if (Sup.Input.wasKeyJustPressed("UP")) 
          {
            velocity.y = this.jumpSpeed;
            this.actor.spriteRenderer.setAnimation("Jump");
            // Send input to server
            this.socket.emit("Input", "jump");
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
    this.actor.arcadeBody2D.setVelocity(velocity);
  }
  
  sendInputs()
  {
    for (var i = 0; i < this.keyList.length; i++)
      {
        if(Sup.Input.wasKeyJustPressed(this.keyList[i]))
          {
            this.socket.emit("keyPress", this.keyList[i]);
          }
        if(Sup.Input.wasKeyJustReleased(this.keyList[i]))
          {
            this.socket.emit("keyRelease", this.keyList[i]);
          }
      }
  }
  
  
  
  /*************************************************************************
  * Purpose: Update the current status and the timers for each status in the status list
  **************************************************************************/
  updateStatus()
  {
    if(this.rollStatus.getTimeRemaining() > 0)
    {
      this.rollStatus.tick();
      //console.log(this.rollStatus.getTimeRemaining());
    }
       
  }
  
  
  
 
  
  
  
  
  
}
Sup.registerBehavior(PlayerBehavior);
