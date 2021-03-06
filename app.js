require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// prefixSymbol and commandString make up the phrase the bot looks for to execute commands ex. !ping
// botMessage is just a string that can be used to add context to an image ex. Warchief
const { prefixSymbol, commandString,  botMessage} = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
// the token from the Discord bot from .env file
const token = process.env.DISCORD_TOKEN;
// use to change albums based on calendar events
const { checkEvent, addEvent, initializeEventsJson } = require('./events.js');
// channel commands
const { userHistory, getImages, userTop, userCurrent, helpCommands } = require('./index');

// channel ID of the channels you want the bot to work in
// get the channel ID by using client.on('message', message => {console.log(message.channel.id)});
const designatedChannels = {};
designatedChannels[process.env.BOT_CHANNEL] = 'botChannel';
designatedChannels[process.env.TEST_BOT_CHANNEL] = 'testBotChannel';             

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// easy way to check if the server is up
// add additional routes for front end functionality
app.get('/', (request, response) => {
  response.json({ info: `${botMessage} bot is up` })
})

// initialize events
const eventInit = async () => {
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
    console.log(`${botMessage} bot is running`);
});

// listens to all messages sent on the Discord server
// string literals require backticks not quotation marks
client.on('message', async message => {
    // change to true to have the bot work on all channels in the connected server
    if (designatedChannels[message.channel.id]) {
        // parses message and returns first 2 words in an array
        let messageCommands = message.content.toLowerCase().split(' ').slice(0,2);
        // prevents infinite bot loops
        if (!messageCommands[0].startsWith(`${prefixSymbol}${commandString}`) || message.author.bot) return;

        if (messageCommands[0].startsWith(`${prefixSymbol}${commandString}`)) {
          switch (messageCommands[1]) {
            case "help":
              helpCommands(message)
              break;
            case "history":
              userHistory(message)
              break
            case "top":
              userTop(message)
              break
            case "current":
              userCurrent(message)
              break
            default:
              let event = checkEvent();
              let defaultAlbum = process.env.DEFAULT_ALBUM;
  
              // getImages also executes createUser method
              if (event) {
                  // event albums
                  getImages(message, event);
              } else {
                  // default album
                  getImages(message, defaultAlbum);
              }
          }
        }
    }
});

// login to Discord with your app's token
client.login(token);

app.listen(3000, () => {
  console.log('Express Running')
})