class AttacksBehavior extends Sup.Behavior {
  
  duration:number = 0;
  timeRemaining:number = 0;
  speed:number = 0; //The maximum scalar speed in pixels/s
  velocity:THREE.Vector3 = new THREE.Vector3(); //The velocit in pix/s
  creatorID:number = 0; // the id of the creator 
  targetsPlayer:boolean = false;
  targetsEnemy:boolean = false;
  collidesTerrain:boolean = false;
  dying:boolean = false;
  
  awake() 
  {
    
  }

  update() 
  {
    this.collisions();
    
    this.move();
    
    this.tick();
    
    if (this.dying === true)
      {
        //if we've reached the end of the dying animation destroy the object
        if (this.actor.spriteRenderer.getAnimationFrameIndex() === this.actor.spriteRenderer.getAnimationFrameCount() - 1)
          {
            this.actor.destroy();
          }
      }
  }
  
  collisions()
  {
    if (this.collidesTerrain)
      {
        let terrain = Sup.getActor("terrain").getChildren();
        for (var i = 0; i < terrain.length; i++)
          {
            if (Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, terrain[i].arcadeBody2D ))
            {
              this.onCollision();
            }
          }
      }
  }
  
  onCollision()
  {
    // Destroy the attack (play the attack collision animation)
    this.actor.spriteRenderer.setAnimation("Collision", false);
    this.dying = true;
  }
  
  move()
  {
    let fps = Sup.Game.getFPS();
    //convert from pix/s to pix/frame allowing for fps independence
    this.actor.arcadeBody2D.setVelocity(this.velocity.x/fps, this.velocity.y/fps);
  }
  
  tick()
  {
      let period = 1/Sup.Game.getFPS();
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
  
}
Sup.registerBehavior(AttacksBehavior);
