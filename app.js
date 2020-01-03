require('dotenv').config();
const { prefix, command } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN;

// this event will only trigger one time after logging in
client.once('ready', () => {
  console.log('Image Bot Ready!');
});

// listens to all messages sent on the Discord server
// string literals require backticks not quotation marks
client.on('message', message => {
    // listens for a specific word or phrase
    console.log(message._edits);
    if (message.content.startsWith(`${prefix}${command}`)) {
        // sends back a message to the channel the original message was sent in
        message.channel.send('Pong.');
    }
});



// login to Discord with your app's token
client.login(token);