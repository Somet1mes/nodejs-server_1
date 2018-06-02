import Status_Effect from "./Status_Effect"

export default class Roll extends Status_Effect 
{
  constructor()
  {
  super();
  this.setStatusName("Stun");
  this.setCanAction(true);
  this.setCanAttack(false);
  this.setCanMove(false);
  this.setActive(false);
  this.setTimeRemaining(0);
  }
  
}

