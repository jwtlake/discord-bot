'use strict';

//set app root
global.appRoot = require('path').resolve(__dirname);

var fs = require('fs');
var Hapi = require('hapi');
var Discord = require("discord.js");
var settings = require('./settings.js');
var mybot = new Discord.Client();

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

//connect
mybot.login(settings.email, settings.password)
.then(function(success){
  console.log(success);
}).catch(function(error){
  console.log('Error connecting as Email: '+ settings.email + ' Password: ' +settings.password);
  console.log(error);
});


// new server instance
var server = new Hapi.Server();

// configure connection
server.connection({
  port: 3001
});

// add routes 
server.route([
  {
    path: '/',
    method: 'GET',
    handler: function(request, reply){
      reply(`<form action="./upload" method="post" enctype="multipart/form-data">
                <span>Choose a MP3 file to upload. The exact file name will then be available as a command.</span>
                <br/>
                <input type="file" name="file">
                <button>Submit</button>
              </form>`);
    }
  },
  {
    method: 'POST',
    path: '/upload',
    config: {
    payload: {
          output: 'stream',
          parse: true,
          allow: 'multipart/form-data'
      },
      handler: function (request, reply) {
            var data = request.payload;
            if (data.file) {
                var name = data.file.hapi.filename;
                var path = appRoot + "/audio/" + name;
                var file = fs.createWriteStream(path);

                file.on('error', function (err) { 
                    console.error(err) 
                });

                data.file.pipe(file);

                data.file.on('end', function (err) { 
                    // var ret = {
                    //     filename: data.file.hapi.filename,
                    //     headers: data.file.hapi.headers
                    // }
                    // reply(JSON.stringify(ret));
                    var newComand = '!'+name.replace(/\.[^/.]+$/, "");
                    reply(`
                      <span>` + newComand + `</span>
                      <br/>
                      <a href=".">Add another?</a>
                    `);

                      
                })
            }

        }
    }
  }
]);

// start server
server.start(function () {
  console.log('Server listening @ ' + server.info.uri);
});
