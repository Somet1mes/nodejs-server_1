

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);


var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


// An array to store all of the players currently
var playerStack = [];

app.get('/', 

	function(req, res)
	{
		res.sendFile(__dirname + '/index.html');
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

	var addedPlayer = false;

	console.log('A user has connected');

	//socket.name = "test";

	socket.on('PlayerInit', 

		/*************************************************
		* Purpose: Add a player to the server, called when someone connects, therby adding their player
		* Imports: The player to be added
		*************************************************/
		function(player)
		{
			// add the player to the list of players
			playerStack.push(player);
			// get the player name (player.name should be unique)
			socket.name = player.name;

			addedPlayer = true;

			console.log(player);
			console.log("player initialised");
		}

	);// end on PlayerInit

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
	



	socket.emit('event stuff', "poop");
	socket.on('event stuff2', 
		function(msg)
		{
			console.log(msg);
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
				playerStack.splice(i, 1);
			}
		}
	}
	); //end on disconnect


}


function playerStackSort()
{
	playerStack.sort(
		function(a, b)
		{
			return a.playerID - b.playerID; 
		});
}





server.listen(server_port, server_ip_address, 
	function()
	{
		console.log("listening on " + server_ip_address + ", port " + server_port);
	}
	);
