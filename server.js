/*************************************************************************************


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
const Hitbox = require('./ts-built/Game/Hitbox.js');
//var Sup = require('./Build')
//var SupCore = require('./Build/SupCore.js');
//var SupEngine = require('./Build/SupEngine.js');
//var Arcade2DPhysicsNEW = require("./Build/plugins/default/arcadePhysics2D/bundles/components.js")
//var SupRuntime = require('./Build/SupRuntime.js');
//var THREE = SupEngine.THREE;
var Status_Effect = require('./ts-built/Game/Player/Status_Effect.js');
var Game = require('./ts-built/Game/Game.js');
var Player = require('./ts-built/Game/Player/Player.js');

// Socket Server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//SQL data base
var mysql = require('mysql');

var pool = mysql.createPool(
    {
        connectionLimit: 100,
        host: "192.168.1.3",
        port: "3307",
        user: "SSOserver",
        password: "candycane",
        database: "sso"
    });

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


// Non-connection based variables


// An array to store all of the players currently
var playerStack = [];
var game_1 = new Game();



// Serve the client files in build so the index.html can access them
app.use(express.static(__dirname + '/Build'));

// Deliver the index.html file to whoever acceses
app.get('/', 

    function(req, res)
    {
        res.sendFile(__dirname + '/Build/index.html');
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

    //var initPlayer = false;

    console.log('A user has connected');

    socket.on('poops', function(a){console.log("poops", a);})
    socket.emit('poops', 13);

    socket.on('checkID',
        function(id)
        {
            console.log(id);
            console.log(typeof id);
            var check = true;
            if (typeof id === "number")
            {
                for (var i = 1; i < playerStack.length -1; i++)
                {
                    if (id === playerstack[i].playerID)
                    {
                        check = false;
                    }
                }
            }
            else
            {
                check = false;
            }
            socket.emit('returnID', check);
        });


    socket.on('Initialise Player', 
        function(playerID)
        {
            console.log("player added", playerID);
            //socket.playerID = playerID;
            socket.player = new Player(); //create a new Player to store every thing about the player
            socket.player.playerID = playerID;
            playerStack.push(socket.player);
            console.log(playerStack);
            playerStackSort();
            socket.emit('Player Initialised');
            // Get the values for the actor from the database given the playerID
            /*
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
                */
        });
    //socket.name = "test";
    

    

    // Whenever the player presses a key
    socket.on("keyPress",
        function(input)
        {
            onKeyPress(socket.player, input);
            console.log(input);
        });
    // Whenever the player releases a key
    socket.on("keyRelease",
        function(input)
        {
            onKeyRelease(socket.player, input);
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
        game_1.updatePlayer(playerStack[i]); // Update everything to with each player
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







