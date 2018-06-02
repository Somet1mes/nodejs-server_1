import Status_Effect from "./Status_Effect"

export default class Stun extends Status_Effect 
{
  constructor()
  {
    super();
    this.setStatusName("Stun");
    this.setCanAction(false);
    this.setCanAttack(false);
    this.setCanMove(false);
    this.setActive(false);
    this.setTimeRemaining(0);
  }
  
}