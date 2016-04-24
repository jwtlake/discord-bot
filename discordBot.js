var Discord = require("discord.js");
var path = require('path'); 
var mybot = new Discord.Client();
var isConnected = false;

//bot settings 
mybot.autoReconnect = true;

//watch for !commands
mybot.on("message", function(message) {
	//check if message for bot
	if(message.content.charAt(0) === "!" && message.content.length > 1) {
		//get requested file from command
		var file = "./audio/" + message.content.slice(1) + ".mp3";
		//check if it exists
		path.exists(file, function(exists) { 
			if (exists) { 
				//play audio file
				playAudioFile(file);
			}
		});
	}
});

//public functions
function login(email, password) {
  mybot.login(email, password)
  .then(function(success){
    console.log(success);
    isConnected = true;
  }).catch(function(error){
    console.log('Error connecting as Email: '+ settings.email + ' Password: ' +settings.password);
    console.log(error);
  });
}

function logout() {
  mybot.logout();
  isConnected = false;
}

function getStatus() {
  return isConnected;
}

function playAudioFile(file) {
	//connect to the current voice channel of commanding user
	mybot.joinVoiceChannel(message.author.voiceChannel, function(error, voice) {
		//play audio file
		voice.playFile(file, {"volume":1.0}, function(error, intent) {
			if (error) console.log(error.stack);
				//diconnect after playing
				intent.on("end", function() {
					mybot.leaveVoiceChannel();
				});
		});
	});
}


//exports
module.exports = {
	login: login,
	logout: logout,
	getStatus: getStatus
}
