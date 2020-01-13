require('dotenv').config();
const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const db = require('./controllers/user')
const { prefix, command } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
// used to make api call to imgur
const request = require('request');
// the token from the Discord bot from .env file
const token = process.env.DISCORD_TOKEN;
// use to change albums based on calendar events
const { checkEvent, addEvent, initializeEventsJson } = require('./events.js');

// channel ID of the channels you want the bot to work in
// get the channel ID by using client.on('message', message => {console.log(message.channel.id)});
var designatedChannels = {};
designatedChannels[process.env.BOT_CHANNEL] = 'botChannel';
designatedChannels[process.env.TEST_BOT_CHANNEL] = 'testBotChannel';             

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)

// initialize events
var eventInit = async () => {
    await initializeEventsJson();
    await addEvent("valentine's day");
    await addEvent("mother's day");
    await addEvent("father's day");
    await addEvent("easter");
    await addEvent("halloween", 6);
    await addEvent("thanksgiving", 1, 2);
    await addEvent("christmas", 1, 6);
    await addEvent("test", 1, 2, "2020-01-06");
}

// this event will only trigger one time after logging in
client.once('ready', () => {
    eventInit();
    console.log('Image Bot Ready!');
});

// listens to all messages sent on the Discord server
// string literals require backticks not quotation marks
client.on('message', message => {
    if (designatedChannels[message.channel.id]) {
        let messageContent = message.content.toLowerCase();
        // prevents infinite bot loops
        if (!messageContent.startsWith(`${prefix}${command}`) || message.author.bot) return;

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
        let image = images.images[Math.floor(Math.random()*images.images_count)];
        // message that is sent back to the channel
        // e.g. `${discordMessage.author.username} drew ${image.title} from (${image.description}) ${image.link}`
        let replyMessage = `${discordMessage.author.username}'s ${process.env.MESSAGE} ${image.title} (${image.description}) ${image.link}`;
  
        discordMessage.channel.send(replyMessage);

        let userInfo = {
          discordInfo: discordMessage.author,
          imageInfo: image
        }
        db.createUser(userInfo, response);
      }
    };
  
    request(options, callback);
  };



// login to Discord with your app's token
client.login(token);

app.listen(3000, () => {
  console.log(`App running.`)
})