require('dotenv').config();
const { prefix, command } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
// used to make api call to imgur
const request = require('request');
// the token from the Discord bot from .env file
const token = process.env.DISCORD_TOKEN;
// use to change albums based on calendar events
const events = require('./events.js');

//Channel ID of the channel you want the bot to work in.
const designatedChannels = { '261731325055074305': 'botChannel',
                             '458186960331341824': 'testBotChannel'                            
                            };

// this event will only trigger one time after logging in
client.once('ready', () => {
  console.log('Image Bot Ready!');
});

// listens to all messages sent on the Discord server
// string literals require backticks not quotation marks
client.on('message', message => {
    // listens for a specific word or phrase
    if (designatedChannels[message.channel.id]) {
        // prevents infinite bot loops
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        if (message.content.startsWith(`${prefix}${command}`)) {
            let event = events.checkEvent();
            let defaultAlbum = 'pmwc4BS';

            if (event) {
                // event albums
                getImages(message, event);
            } else {
                // default album
                getImages(message, defaultAlbum);
            }
    
        }
    }
});

function getImages(discordMessage, album) {
    var options = {
    //url to IMGUR album
      url: `https://api.imgur.com/3/album/${album}/images`,
      headers: {
      'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`
      }
    };
  
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        var images = info.data;
        var image = images[Math.floor(Math.random()*images.length)];
        var replyMessage = `${discordMessage.author.username}'s image is ${image.title} (${image.description}) ${image.link}`;
  
        discordMessage.channel.send(replyMessage);
      }
    };
  
    request(options, callback);
  };



// login to Discord with your app's token
client.login(token);