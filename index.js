var Discord = require("discord.js");
var settings = require('./settings.js');
var mybot = new Discord.Client();

mybot.on("message", function(message){
    if(message.content === "!test") {
       mybot.joinVoiceChannel(message.author.voiceChannel, function(error, voice) {
           voice.playFile("./res/AndHisNameIsJohnCena.mp3", {"volume":1.0}, function(error, intent) {
             if (error) console.log(error.stack);
  	             intent.on("end", function() {
                     mybot.leaveVoiceChannel();
                 });
           });
      });
    }
});

//connect
mybot.login(settings.email, settings.password);
