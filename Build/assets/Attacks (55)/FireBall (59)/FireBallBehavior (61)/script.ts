class FireBallBehavior extends AttacksBehavior {
  awake() {
    this.duration = 1; //in s
    this.timeRemaining = this.duration;
    this.speed = 10; //in pix/s
    this.collidesTerrain = true;
  }

  update() {
    super.update();
  }
}
Sup.registerBehavior(FireBallBehavior);
