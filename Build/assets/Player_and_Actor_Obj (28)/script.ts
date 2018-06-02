class Player_and_Actor_Obj
  {
    actor: Sup.Actor;
    playerID: number;
    
    constructor()
    {
      this.actor = new Sup.Actor("why tf does it need a name");
      
    }
    
    clone(inObj: Player_and_Actor_Obj)
    {
      if (typeof inObj === "Player_and_Actor_Obj")
        {
          
        }
    }
    
    actions(action)
    {
    let isAttacking = false;
    if (action.type === "FireBall")
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
            
        if (action.dir === "DOWN")
          {
            behav.velocity.y = -behav.speed + velocity.y * fps;
            //These rotations are weird
            attack.setLocalEulerAngles(0,0,-Math.PI/2);
          }
        else if(action.dir === "UP")
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
  }