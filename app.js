require('dotenv').config();
const { prefix, command } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
// used to make api call to imgur
const request = require('request');
// the token from the Discord bot from .env file
const token = process.env.DISCORD_TOKEN;
// use to change albums based on calendar events
const { checkEvent } = require('./events.js');

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
    let messageContent = message.content.toLowerCase();

    if (designatedChannels[message.channel.id]) {
        // prevents infinite bot loops
        if (!messageContent.startsWith(prefix) || message.author.bot) return;

        if (messageContent.startsWith(`${prefix}${command}`)) {
            let event = checkEvent();
            let defaultAlbum = process.env.DEFAULT_ALBUM;

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
    let options = {
    //url to IMGUR album
      url: `https://api.imgur.com/3/album/${album}`,
      headers: {
      'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`
      }
    };
  
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        let info = JSON.parse(body);
        let images = info.data;
        let image = images.images[Math.floor(Math.random()*128)];
        console.log(image)
        // message that is sent back to the channel
        let replyMessage = `${discordMessage.author.username}'s image is ${image.title} (${image.description}) ${image.link}`;
  
        discordMessage.channel.send(replyMessage);
      }
    };
  
    request(options, callback);
  };



// login to Discord with your app's token
client.login(token);