class Server_Clone_Behavior extends Sup.Behavior {
  awake() 
  {
        //this.actor.arcadeBody2D.setCustomGravity(0,0);
  }

  update() 
  {
    //Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());

  }
}
Sup.registerBehavior(Server_Clone_Behavior);
