const db = require('./controllers/user')
const { prefix, command } = require('./config.json');

module.exports = {
    helpCommands: (message) => {
        let preCom = `${prefix}${command}`
        let commands = [`__**Help for ${process.env.MESSAGE} bot**__`,
                        `${preCom} - Draw ${process.env.MESSAGE}`, 
                        `${preCom} current - Current ${process.env.MESSAGE}`,
                        `${preCom} history - Get all previous ${process.env.MESSAGE}'s`,
                        `${preCom} top - Most drawn ${process.env.MESSAGE}'s`,
                        `${preCom} help - Show commands`,
                        `- Only one draw per day.`,
                        `- ${process.env.MESSAGE}'s are unique for the week.`,
                        `- Holiday ${process.env.MESSAGE}'s enabled.`
                     ]

        let replyMessage = `${commands.join('\n\n')}`

        message.channel.send(replyMessage);
    },
    userHistory: async (message) => {
        let user = await db.getUserByDiscordID(message.author)
        let history = JSON.parse(user.history);
        let userHistory = [];
        let totalDraws = 0

        for (const [key, val] of Object.entries(history)) {
          userHistory.push(`${key} : ${val.count}`)
          totalDraws += val.count
        }

        let replyMessage = `${message.author.username} drew ${totalDraws} ${process.env.MESSAGE}'s - ${userHistory.join(", ")}`;
        
        message.channel.send(replyMessage);
    },
    getImages: (message, album) => {
        // used to make api call to imgur
        const request = require('request');
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
            let replyMessage = `${message.author.username}'s ${process.env.MESSAGE} is ${image.title} (${image.description}) ${image.link}`;
      
            message.channel.send(replyMessage);
    
            let userInfo = {
              discordInfo: message.author,
              imageInfo: image
            }
    
            db.createUser(userInfo, response);
          }
        };
      
        request(options, callback);
      },
      userTop: async (message) => {
        let user = await db.getUserByDiscordID(message.author)
        let history = JSON.parse(user.history);
        let topDraw = {name: [], count: 0}
        let replyMessage;

        for (const [key, val] of Object.entries(history)) {
          if (val.count === topDraw.count) {
              topDraw.name.push(key)
          } else if (val.count > topDraw.count) {
              topDraw.name = [key]
              topDraw.count = val.count
          }
        }

        if (topDraw.name.length > 1) {
            replyMessage = `${message.author.username} top ${process.env.MESSAGE}'s are ${topDraw.name.join(', ')} at ${topDraw.count}.`;
        } else {
            replyMessage = `${message.author.username} top ${process.env.MESSAGE} is ${topDraw.name.join(', ')} at ${topDraw.count}.`;
        }

        message.channel.send(replyMessage);
      },
      userCurrent: async (message) => {
        let user = await db.getUserByDiscordID(message.author)
        let currentImage = user.currentImage
        let replyMessage = `${message.author.username} current ${process.env.MESSAGE} is ${currentImage}.`

        message.channel.send(replyMessage);
      }
}