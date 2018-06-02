"use strict";

export default class Status_Effect
  {
    
    private statusName: String;     // The status name
    private canAction: Boolean      //Does the current status allow for any action 
    private canAttack: Boolean      //Does the current status allow for attack actions
    private canMove: Boolean        //Does the current stats allow for movment actions
    private timeRemaining: number   //How long the status has left
    private active: Boolean         //Is the status active
    
    
    // Constructors
    
    /*************************************************
    * Constructor
    **************************************************/
    constructor(inStatusName?: String, inTimeRemaining?: number)
    {
      this.setStatusName(inStatusName || "none");
      this.timeRemaining = inTimeRemaining || -1;
    }
    
    
    
    //Accessors
    
    getStatusName(): String 
    {
      return this.statusName;
    }
    
    getCanAction()
    {
      return this.canAction;
    }
    
    getCanAttack()
    {
      return this.canAttack;
    }
    
    getCanMove()
    {
      return this.canMove;
    }
    
    getActive()
    {
      return this.active;
    }
        
    getTimeRemaining(): number
    {
      return this.timeRemaining;
    }
    
    
    
    //Mutators
    
    setTimeRemaining(inTimeRemaining: number)
    {
      //console.log(inTimeRemaining + " " + this.timeRemaining);
      if (this.timeRemaining < inTimeRemaining)
        {
          this.timeRemaining = inTimeRemaining;
        }
      
      if (this.timeRemaining > 0)
        {
          this.active = true;
        }
      else
      {
        this.active = false;
      }
    }
    
    setActive(inActive: boolean)
    {
      this.active = inActive;
    }
    
    setStatusName(inStatus: String)
    {
      this.statusName = inStatus;
    }
      
    setCanAction(inValue: Boolean)
    {
      this.canAction = inValue;
    }
    
    
    setCanAttack(inValue: Boolean)
    {
      this.canAttack = inValue;
    }
    
    setCanMove(inValue:boolean)
    {
      this.canMove = inValue;
    }
    
   //checks if status is still active 
   tick(period)
   {
      this.timeRemaining = this.timeRemaining - period;
      if(this.timeRemaining <= 0)
        {
          this.active = false;
        }
    }
    

};

