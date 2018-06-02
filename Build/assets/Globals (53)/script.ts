namespace Globals
{
  
  // All varibles here have accesors (getVar) and mutators(setVar)
  var gravity = new Sup.Math.Vector2();
  var playerID:number;
  var clientSocket;
  export var serverClone:Sup.Actor;
  
  export function setGravityV(inG:Sup.Math.Vector2)
  {
    gravity = inG;
  }
  export function setGravity(x:number, y:number)
  {
    gravity.x = x;
    gravity.y = y;
  }
  export function getGravity()
  {
    return gravity;
  }
  
  export function setPlayerID(pid)
  {
    playerID = pid;
  }
  export function getPlayerID()
  {
    return playerID;
  }
  
  export function setClientSocket(socket)
  {
    clientSocket = socket;
  }
  export function getClientSocket()
  {
    return clientSocket;
  }
  
  export function setServerClone(inclone)
  {
    serverClone = inclone;
  }
  export function getServerClone()
  {
    return serverClone;
  }
  
}