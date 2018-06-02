"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __importDefault(require("./Game/Game"));
var Player_1 = __importDefault(require("./Game/Player/Player"));
// requires
//import napa = require("napajs");
// Socket Server
var express = require("express");
var app = express();
var imp_server = require("http");
var server = new imp_server.Server(app);
var imp_io = require("socket.io");
var io = imp_io.listen(server);
//SQL data base
var mysql = require("mysql");
var pool = mysql.createPool({
    connectionLimit: 100,
    host: "192.168.1.3",
    port: "3307",
    user: "SSOserver",
    password: "candycane",
    database: "sso"
});
var server_port = +process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
// Non-connection based variables
// The tick period of the server (in seconds)
var period = 0.010;
// An array to store all of the players currently
var playerStack = [];
var mapPath = './Build/assets/Map\ (6)/tilemap.json';
var setPath = './Build/assets/Tile\ Set\ (4)/tileset.json';
var game_1 = new Game_1.default(period, mapPath, setPath);
// Serve the client files in build so the index.html can access them
app.use(express.static(__dirname + '/../Build'));
// Deliver the index.html file to whoever acceses
app.get('/', function (req, res) {
    res.sendFile('/Build/index.html', { root: '../' + __dirname });
});
io.on('connection', onConnection);
/*****************************************************
* Purpose: Setup for when someone connects
* Imports: socket - the individual conetion socket
* exports: none
******************************************************/
function onConnection(socket) {
    //var initPlayer = false;
    console.log('A user has connected');
    socket.on('poops', function (a) { console.log("poops", a); });
    socket.emit('poops', 13);
    socket.on('checkID', function (id) {
        console.log(id);
        console.log(typeof id);
        var check = true;
        if (typeof id === "number" && id > 0) {
            for (var i = 0; i < playerStack.length; i++) {
                //console.log(playerStack[i].playerID, id);
                if (id === playerStack[i].playerID) {
                    check = false;
                }
            }
        }
        else {
            check = false;
        }
        if (check === true) {
            socket.checked = true;
            socket.playerID = id;
        }
        socket.emit('returnID', check);
    });
    socket.on('Initialise Player', function () {
        if (socket.checked === true) // check that a valid playerID has been given to this socket 
         {
            console.log("player added", socket.playerID);
            //socket.playerID = playerID;
            socket.player = new Player_1.default(20, 8); //create a new Player to store every thing about the player
            socket.player.playerID = socket.playerID;
            playerStack.push(socket.player);
            game_1.addPlayer(socket.player.playerID, socket.player);
            // join the socket room for game_1
            socket.join("game_1");
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
        }
        else {
            console.log("Initialsation rejected for unchecked socket");
        }
    });
    //socket.name = "test";
    // Whenever the player presses a key
    socket.on("keyPress", function (input) {
        if (socket.checked === true) {
            game_1.onKeyPress(socket.playerID, input.key, input.time);
            //console.log(socket.playerID, input);
        }
    });
    // Whenever the player releases a key
    socket.on("keyRelease", function (input) {
        if (socket.checked === true) {
            game_1.onKeyRelease(socket.playerID, input.key, input.time);
        }
    });
    // Whenever the player sends an action
    socket.on("action", function (input) {
        if (socket.checked === true) {
            game_1.onAction(socket.playerID, input.action, input.time);
        }
    });
    /*
    socket.on("tick",
        function()
        {
            updatePos(socket.actor);
        })
    */
    socket.on('disconnect', 
    /***********************************************
    * Purpose: Run when someone disconnects to remove them
    * Imports: socket - the socket for the disconecting player
    ******************************************************/
    function () {
        console.log(socket.playerID + ' disconnected');
        for (var i = playerStack.length - 1; i >= 0; i--) {
            if (playerStack[i].playerID === socket.playerID) {
                playerStack.splice(i, 1); //remove the player from the array
            }
        }
        console.log(playerStack);
    }); //end on disconnect
}
// For sorting the playerstack by playerID
function playerStackSort() {
    playerStack.sort(function (a, b) {
        return a.playerID - b.playerID;
    });
}
// For the servers game tick interval
setInterval(function () {
    //io.emit("tick");
    tick();
}, period * 1000); // run at ~30 ticks per second (33ms per tick)
// what to do every server tick
var tickCounter = 0;
function tick() {
    //tick.count = tick.count || 0; //using count as a static variable, it should only be set to 0 if it hasn't been set before
    //tick.count++;
    /* This is now done in the Game class
    for (var i = playerStack.length - 1; i >= 0; i--)
    {
        game_1.updatePlayer(playerStack[i]); // Update everything to with each player
    }
    */
    game_1.update();
    tickCounter++;
    //io.emit('Update Players', playerStack);
    // Only send updates to the clients every 5 server ticks
    if (tickCounter >= 0) {
        tickCounter = 0;
        // only emit to sockets in room "game_1"
        io.in("game_1").emit('Update Players', playerStack);
    }
}
server.listen(server_port, server_ip_address, function () {
    console.log("listening on ", server_ip_address, ", port ", server_port);
});
