'use strict';

//set app root
global.appRoot = require('path').resolve(__dirname);

//dependencies
var fs = require('fs');
var Hapi = require('hapi');
var settings = require('./settings.js');
var discordBot = require('./discordBot');

//new server instance
var server = new Hapi.Server();

//configure connection
server.connection({
  port: 3301
});

//add routes 
server.route([
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      var status = discordBot.getStatus() ? 'ONLINE' : 'OFFLINE';
      reply(`<div>
                <div>
                  <span>DiscordBot Status: ` + status + `</span>
                </div>
                <div>
		</br>
                <form action="./upload" method="post" enctype="multipart/form-data">
                  <span>Choose a MP3 file to upload. The exact file name will then be available as a command.</span>
                  <br/>
                  <input type="file" name="file">
                  <button>Submit</button>
                </form>
                </div>
              </div>`);
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
            //get user provided file
            var data = request.payload;
            if (data.file) {
              //get file info
                var name = data.file.hapi.filename;
                var path = appRoot + "/audio/" + name;
                var file = fs.createWriteStream(path);

                //catch errors
                file.on('error', function (err) { 
                    console.error(err);
                    reply('<span>Error uploading file!</span>'); 
                });

                data.file.pipe(file);

                //when upload finishes successfully
                data.file.on('end', function (err) {
                  //return new available command 
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
  },
  {
    method: 'GET',
    path: '/list',
    handler: function(request, reply) {
      //get mp3 files
      fs.readdir('./audio', function(err, files) {
        if(err){
          reply(err);
        }else{
          reply(files);
        }
      })      
    }
  }
]);

//start server
server.start(function () {
  console.log('Server listening @ ' + server.info.uri);
});

//log on bot
discordBot.login(settings.email, settings.password);
