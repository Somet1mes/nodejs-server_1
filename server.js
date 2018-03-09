<<<<<<< HEAD
"use strict";
=======
/*************************************************************************************
>>>>>>> 15a7cbe917983b221f024cdf3e87d501613cab1b

//other classes
const hitbox = require('./hitbox.js');

<<<<<<< HEAD
=======
Alright guys this is how this is gonna go down

    first the server will authenticate with the sql database

    Then when someone connects we send them the client html file

    Then from the client they send us the player id and we tell them if it worked

        if it dd work then we initialise their player on the game part of the server
        this is also when the client should load up the actual game bit 

            in the game bit, the client should send us the inputs and we should send it 
            the positions, velocities and animations of everything thats server controled
                which is probablly anything that moves



*************************************************************************************/


"use strict";

//other classes
const hitbox = require('./hitbox.js');
var SupEngine = require('./Build/SupEngine.js');
var THREE = SupEngine.THREE;

>>>>>>> 15a7cbe917983b221f024cdf3e87d501613cab1b
// Socket Server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//SQL data base
var mysql = require('mysql');
<<<<<<< HEAD

var pool = mysql.createPool(
    {
        connectionLimit: 100,
        host: "192.168.1.3",
        port: "3307",
        user: "SSOserver",
        password: "candycane",
        database: "sso"
    });

=======

var pool = mysql.createPool(
    {
        connectionLimit: 100,
        host: "192.168.1.3",
        port: "3307",
        user: "SSOserver",
        password: "candycane",
        database: "sso"
    });

>>>>>>> 15a7cbe917983b221f024cdf3e87d501613cab1b


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


// An array to store all of the players currently
var playerStack = [];

<<<<<<< HEAD
// Set the file with all the client stuff so it can be sent so index.html can use it
=======
>>>>>>> 15a7cbe917983b221f024cdf3e87d501613cab1b

app.use(express.static(__dirname + '/Build'));

// Deliver the index.html file to whoever acceses
app.get('/', 

    function(req, res)
    {
<<<<<<< HEAD
        res.sendFile(__dirname + '/Builds/index.html');
=======
        res.sendFile(__dirname + '/Build/index.html');
>>>>>>> 15a7cbe917983b221f024cdf3e87d501613cab1b
    }
    );

io.on('connection', onConnection);

/*****************************************************
* Purpose: Setup for when someone connects
* Imports: socket - the individual conetion socket
* exports: none
******************************************************/
function onConnection(socket)
{

    var initPlayer = false;

    console.log('A user has connected');


    socket.on('Initialise Player', 
        function(playerID)
        {
            socket.playerID = playerID;
        });
    //socket.name = "test";
    socket.actor = new Actor(); //create a new actor to store every thing about the player

    // Get the values for the actor from the database given the playerID
    pool.getConnection(
        function(err, connection)
        {
            if (err)
            {
                console.log("error connecting to database");
                console.log(err);
            }
            else
            {
                connection.query("SELECT * from playerstats where playerID" + socket.playerID, 
                function(err, row)
                {
                    console.log(row);
                });
            }

        });

    // Whenever the player presses a key
    socket.on("keyPress",
        function(input)
        {
            onKeyPress(socket.actor, input);
        });
    // Whenever the player releases a key
    socket.on("keyRelease",
        function(input)
        {
            onKeyRelease(socket.actor, input);
        });
    

    /*
    socket.on("tick",
        function()
        {
            updatePos(socket.actor);
        })
    */

    socket.on('Request Players',
        function(playerObj)
        {


            var count = 0;
            var length = playerStack.length
            for (var i = length - 1; i >= 0; i--) 
            {
                if (playerStack[i].playerID === playerObj.playerID)
                {
                    playerStack[i] = playerObj;
                }
                else
                {
                    count++;
                }
            }
            if (count === length) //we went through the whole array without a match
            {
                playerStack.push(playerObj);
                socket.playerID = playerObj.playerID;
                console.log(socket.playerID + " was added");
            }
            playerStackSort();
            //console.log(playerStack);

            socket.emit('Update Players', playerStack);
        });
    

    socket.on('disconnect',

    /***********************************************
    * Purpose: Run when someone disconnects to remove them
    * Imports: socket - the socket for the disconecting player
    ******************************************************/
    function()
    {
        console.log(socket.playerID + ' disconnected');
        console.log(playerStack);

        for (var i = playerStack.length - 1; i >= 0; i--) 
        {
            if (playerStack[i].playerID === socket.playerID)
            {
                playerStack.splice(i, 1); //remove the player from the array
            }
        }
    }
    ); //end on disconnect


}

// For sorting the playerstack by playerID
function playerStackSort()
{
    playerStack.sort(
        function(a, b)
        {
            return a.playerID - b.playerID; 
        });
}

// For the servers game tick interval
setInterval(function()
{
    //io.emit("tick");
    tick();
}, 33); // run at ~30 ticks per second (33ms per tick)

// what to do every server tick
function tick()
{
    tick.count = tick.count || 0; //using count as a static variable, it should only be set to 0 if it hasn't been set before

    tick.count++;

    for (var i = playerStack.length - 1; i >= 0; i--) 
    {
        updatedPlayer(playerStack[i]); // Update everything to with each player
    }

    // Only send updates to the clients every 5 server ticks
    if (tick.count === 5)
    {
        tick.count = 0;
        io.emit('Update Players', playerStack);
    }
}




server.listen(server_port, server_ip_address, 
    function()
    {
        console.log("listening on " + server_ip_address + ", port " + server_port);
    }
    );






/*************************************************************************

    Functions to do with game mechanics

***************************************************************************/

var gravityY = -0.2;
var gravityX = 0;

function Actor()
{

    // Stats
    this.HP = 0;
    this.mana = 0;
    this.agility = 0;
    this.defence = 0;
    this.AP = 0;
    this.AD = 0;

    //Keys
    this.key_Array = []
    this.key_LEFT = new Key();
<<<<<<< HEAD
    this.key_Array.push(key_LEFT);
    this.key_RIGHT = new Key();
    this.key_Array.push(key_RIGHT);
    this.key_UP = new Key();
    this.key_Array.push(key_UP);
    this.key_DOWN = new Key();
    this.key_Array.push(key_DOWN);
=======
    this.key_Array.push(this.key_LEFT);
    this.key_RIGHT = new Key();
    this.key_Array.push(this.key_RIGHT);
    this.key_UP = new Key();
    this.key_Array.push(this.key_UP);
    this.key_DOWN = new Key();
    this.key_Array.push(this.key_DOWN);
>>>>>>> 15a7cbe917983b221f024cdf3e87d501613cab1b

    //Sprite + Animation
    this.animation = "Idle"
    this.horzFlip = false;


    // Not actual stats
    this.velocityX = 0;
    this.velocityY = 0;
    this.x = 0;
    this.y = 0;
    this.direction = "left";
    this.animation = "idle";
    this.moveSpeed = 0;
    this.rollSpeed = 0;
    this.jumpSpeed = 0;

<<<<<<< HEAD
=======


>>>>>>> 15a7cbe917983b221f024cdf3e87d501613cab1b
    // Hit box
    this.hitbox = new hitbox(1,1,1,1);

}

function Key()
{
    this.active = false;
    this.wasJustPressed = false;
    this.wasJustReleased = false;
    this.prev = false; //false = up true = down
}


function updatePlayer(player)
{

    //Do key state changes
    for (var i = 0; i < player.key_Array.length; i++)
    {

        player.key_Array[i].wasJustPressed = false;
        player.key_Array[i].wasJustReleased = false;
        if (player.key_Array[i].prev !== player.key_Array[i].active)
        {
            if (player.key_Array[i].active === false)
            {
                player.key_Array[i].wasJustReleased = true;
            }
            else
            {
                player.key_Array[i].wasJustPressed = true;
            }
        }
        player.key_Array[i].prev = player.key_Array[i].active;
    }

    playerMovements(player);

    // Apply gravity
    player.velocityY += gravityY;
    plaeyr.velocityX += gravityX;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;
}


function onKeyPress(player, input)
{
    switch(input)
    {
        case "UP":
            player.key_UP.active =true;
            break;
        case "DOWN":
            player.key_DOWN.active =true;
            break;
        case "LEFT":
            player.key_LEFT.active =true;
            break;
        case "RIGHT":
            player.key_RIGHT.active =true;
            break;
        default:
            console.log("Unrecognised key Release");
            break;
    }
}

function onKeyRelease(player, input)
{
    switch(input)
    {
        case "UP":
            player.key_UP.active =false;
            break;
        case "DOWN":
            player.key_DOWN.active =false;
            break;
        case "LEFT":
            player.key_LEFT.active =false;
            break;
        case "RIGHT":
            player.key_RIGHT.active =false;
            break;
        default:
            console.log("Unrecognised key Release");
            break;
    }
}

function playerMovements(player)
{
    if (player.rollStatus.getActive() === false)
      {
        //check velocity so player cant roll while in the air
        if (player.key_LEFT.active && player.key_DOWN.wasJustPressed && player.velocityY === 0) //roll to the left
          {
            player.velocityX = -player.rollSpeed; //set the velocity 
            player.horzFlip = true;
            player.animation = "Roll";
            player.rollStatus.setTimeRemaining(player.rollDuration); //Setting the duration sets the effect to active


            
          }
        else if (player.key_RIGHT.active && player.key_DOWN.wasJustPressed && player.velocityY === 0)
          {
            player.velocityX = player.rollSpeed;
            player.horzFlip = false;
            player.animation = "Roll";
            player.rollStatus.setTimeRemaining(player.rollDuration);

          }

          // We override the `.x` component based on the player's input
        else if (player.key_LEFT.active) {
          player.velocityX = -player.moveSpeed;
          // When going left, we flip the sprite
          player.horzFlip = true;
          player.animation = "Run";
          

          
        } else if (player.key_RIGTH.active) {
          player.velocityX = player.moveSpeed;
          // When going right, we clear the flip
          player.horzFlip = false;
          player.animation = "Run";

        } else player.velocityX = 0;

        // If the player is on the ground and wants to jump,
        // we update the `.y` component accordingly
        let touchBottom = player.actor.arcadeBody2D.getTouches().bottom;
        if (touchBottom) 
        {
          if (player.key_UP.wasJustPressed) 
          {
            player.velocityY = player.jumpSpeed;
            player.animation = "Jump";

          } 
          else 
          {
            // Here, we should play either "Idle" or "Run" depending on the horizontal speed
            if (player.velocityX === 0) player.animation = "Idle"
            //else player.animation
          }
        } 
        else 
        {
          // Here, we should play either "Jump" or "Fall" depending on the vertical speed
          if (player.velocityY >= 0) player.animation = "Jump";
          else player.animation = "Fall"
        }
      }

}

function move(player, dir)
{
    switch(dir)
    {
        case "left":
            player.velocityX = -player.moveSpeed;
            player.direction = "left";
            break;
        case "right":
            player.velocityX = -player.moveSpeed;
            player.direction = "right";
            break;
        default:
            player.velocityX = 0;
            break;
    }

    player.animation = "run";
}

function jump(player)
{
    player.velocityY = player.jumpSpeed;
    player.animation = "jump";
}

function roll(player, dir)
{
    switch(dir)
    {
        case "left":
            player.velocityX = -player.rollSpeed;
            player.direction = "left";
            break;
        case "right":
            player.velocityX = player.rollSpeed;
            player.direction = "left";
            break;
    }

    player.animation = "roll";
}
