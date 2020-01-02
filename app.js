const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;

// this event will only trigger one time after logging in
client.once('ready', () => {
  console.log('Image Bot Ready!');
});

// listens to all messages sent on the Discord server
client.on('message', message => {
    // listens for a specific word or phrase
    if (message.content === '!ping') {
        // sends back a message to the channel the original message was sent in
        message.channel.send('Pong.');
    }
});



// login to Discord with your app's token
client.login(token);