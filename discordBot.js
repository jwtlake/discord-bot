var Discord = require("discord.js");
var mybot = new Discord.Client();

//bot settings 
mybot.autoReconnect = true;

//watch for !commands
mybot.on("message", function(message){
    //check if message for bot
    if(message.content.charAt(0) === "!" && message.content.length > 1) {
       mybot.joinVoiceChannel(message.author.voiceChannel, function(error, voice) {
           //AndHisNameIsJohnCena
           voice.playFile("./audio/" + message.content.slice(1) + ".mp3", {"volume":1.0}, function(error, intent) {
             if (error) console.log(error.stack);
  	             intent.on("end", function() {
                     mybot.leaveVoiceChannel();
                 });
           });
      });
    }
});

//public functions
function login(email, password){
  this.mybot.login(email, password)
  .then(function(success){
    console.log(success);
  }).catch(function(error){
    console.log('Error connecting as Email: '+ settings.email + ' Password: ' +settings.password);
    console.log(error);
  });
}

function logout(){
  this.mybot.logout();
}

//exports
module.exports = {
	login: login,
	logout: logout
}