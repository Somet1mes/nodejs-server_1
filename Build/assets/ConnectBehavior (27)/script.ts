

class ConnectBehavior extends Sup.Behavior 
{
  name = "subject1";
  playerID = Globals.getPlayerID();
  playerObj = new Player_Obj();
  
  socket;
  currentPlayerStack: Player_and_Actor_Obj[];
  userActor: Sup.Actor;
  userClone: Player_and_Actor_Obj;
  userBehavior;

  
  
  
  awake() 
  {
    
    this.currentPlayerStack = [];
    
    let userPlayer = new Player_and_Actor_Obj();
    userPlayer.actor = Sup.appendScene("Player/pre")[0];
    userPlayer.actor.arcadeBody2D.warpPosition(20, 8);
    this.userActor = userPlayer.actor;
    this.userClone = new Player_and_Actor_Obj();
    this.userClone.actor = Sup.appendScene("Server_Clone/Prefab")[0];
    Globals.serverClone = this.userClone.actor;
    
    this.updatePlayerObj();
    
    userPlayer.actor = this.userActor;
    userPlayer.actor.setPosition(this.playerObj.x, this.playerObj.y);
    userPlayer.actor.spriteRenderer.setAnimation("Idle");
    userPlayer.playerID = this.playerID;
    this.currentPlayerStack.push(userPlayer);

    
        // Connect to the server 
    this.connectToServer();
    // Pass the socket onto the player behaviour
    this.userBehavior = this.userActor.getBehavior(PlayerBehavior);
    this.userBehavior.socket = Globals.getClientSocket();
  }

  update() 
  {
    //this.requestUpdateFromServer();
    //camera follow player
    
    
    //Make 
  }
  
  updatePlayerObj()
  {
    this.playerObj.name = this.name;
    this.playerObj.playerID = this.playerID;
    this.playerObj.x = this.userActor.getX();
    this.playerObj.y = this.userActor.getY();
    this.playerObj.animation = this.userActor.spriteRenderer.getAnimation();
  }
  
  sortPlayerStack()
  {
    this.currentPlayerStack.sort(
      function(a, b)
      {
        return a.playerID - b.playerID; 
      });
  }
  
  /*********************************************************************************************************************88
  *
  *         Connection and Server functions
  *
  *************************************************************************************************************************/
  
  connectToServer()
  {
    // This connects to the server at the given url
    //this.socket = io(this.serverURL);
    // We now use a global socket variable clientSocket
    // initialise the player on the server
    var clientSocket = Globals.getClientSocket();
    clientSocket.emit('Initialise Player', this.playerID);
    console.log(clientSocket);
    
    var _self = this;
    var count;
    
    clientSocket.on('Player Initialised',
                  function()
                  {
      // Only look to update players after after the servers has told us we've been initialised
      clientSocket.on('Update Players', 

                     function(playerStack: Player_Obj[])
        {

          //console.log(playerStack);
          count = 0;

          let tempPlayer = new Player_and_Actor_Obj();
          for(var i = 0; i < _self.currentPlayerStack.length; i++)
            {
              // Since the playerStack is sorted with lowest id at the start and highest at the end
              //if this occurs then there used to be a playerID in currentPlayerStack but it's no longer there
              //so it must have dissconected, in which case we need to remove it
              if (i >= playerStack.length) // this is for the playerStack being shorter than the client playerStack
                {
                  console.log(_self.currentPlayerStack);
                  console.log(playerStack);
                  _self.currentPlayerStack[i].actor.destroy(); //destroy the player whos no longer here
                  _self.currentPlayerStack.splice(i, 1); //remove it from the array
                  console.log("Removed other player1");
                }
              else if (_self.currentPlayerStack[i].playerID < playerStack[i].playerID) // this is for the comments above
                {
                  _self.currentPlayerStack[i].actor.destroy(); //destroy the player whos no longer here
                  _self.currentPlayerStack.splice(i, 1); //remove it from the array
                  console.log("Removed other player2");
                }
              // This means there is a player in the servers playerStack not in ours, os we have to add it
              else if(_self.currentPlayerStack[i].playerID > playerStack[i].playerID)
                {
                  console.log("Try to add anothre player1")
                  tempPlayer.actor = Sup.appendScene("Multiplayer/Prefab")[0];
                  tempPlayer.actor.arcadeBody2D.warpPosition(playerStack[i].x, playerStack[i].y);
                  tempPlayer.actor.spriteRenderer.setAnimation(playerStack[i].animation);
                  tempPlayer.playerID = playerStack[i].playerID;
                  _self.currentPlayerStack.splice(i, 0, tempPlayer);
                  _self.sortPlayerStack();
                  console.log("Added other player1");
                }
              // This menas the player is still here and we need to update it's position etc
              else if (_self.currentPlayerStack[i].playerID === playerStack[i].playerID)
                {
                  if (_self.currentPlayerStack[i].playerID !== _self.playerID)
                    {
                      _self.updatePlayerParams(_self.currentPlayerStack[i], playerStack[i]);
                      _self.currentPlayerStack[i].actor.spriteRenderer.setAnimation(playerStack[i].animation);
                      console.log("Updated other player");
                    }
                  else
                    {
                      _self.updatePlayerParams(_self.userClone, playerStack[i])
                      //console.log(playerStack[i]);
                    }
                }
                count++;
            }

            // Add another player as the given playerstack is shorter than the number of players we've updated (count)
            if (count < playerStack.length)
              {
                for (var ii = count; ii < playerStack.length; ii++)
                  {
                    console.log("try to add another player2")
                    tempPlayer.actor = Sup.appendScene("Multiplayer/Prefab")[0];
                    tempPlayer.actor.arcadeBody2D.warpPosition(playerStack[i].x, playerStack[i].y);
                    tempPlayer.actor.spriteRenderer.setAnimation(playerStack[i].animation);
                    tempPlayer.playerID = playerStack[i].playerID;
                    _self.currentPlayerStack.push(tempPlayer);
                    _self.sortPlayerStack();
                    console.log("Added other player2");
                    console.log(_self.currentPlayerStack);
                    console.log(playerStack);
                  }
              }
         }); // end Update Players
      }); // end Player initialised
    
    
    
  }
  
  
  // Where cPlayer is the clientsided player object and sPlayer the server sided one
  // This will update cPlayer to the values of sPlayer
  updatePlayerParams(cPlayer:Player_and_Actor_Obj, sPlayer)
  {
    let fps = Sup.Game.getFPS();
    cPlayer.actor.arcadeBody2D.warpPosition(sPlayer.x,sPlayer.y);
    cPlayer.actor.spriteRenderer.setAnimation(sPlayer.animation);
    cPlayer.actor.spriteRenderer.setHorizontalFlip(sPlayer.horzFlip);
    cPlayer.actor.arcadeBody2D.setVelocity(sPlayer.hitbox.velocity.x/fps, sPlayer.hitbox.velocity.y/fps);
    cPlayer.actions(sPlayer.action)
  }
  
  
  
}
Sup.registerBehavior(ConnectBehavior);
