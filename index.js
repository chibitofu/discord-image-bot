const db = require('./controllers/user')
const { prefixSymbol, commandString, botMessage } = require('./config.json');
const redis = require('redis');

module.exports = {
    helpCommands: (message) => {
        let preCom = `${prefixSymbol}${commandString}`
        let commands = [`__**Help for ${botMessage} bot**__`,
                        `${preCom} - Draw ${botMessage}`, 
                        `${preCom} current - Current ${botMessage}`,
                        `${preCom} history - Get all previous ${botMessage}'s`,
                        `${preCom} top - Most drawn ${botMessage}'s`,
                        `${preCom} help - Show commands`,
                        `- Only one draw per day.`,
                        `- ${botMessage}'s are unique for the week.`,
                        `- Holiday ${botMessage}'s enabled.`
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
          userHistory.push(`${key}`)
          totalDraws += val.count
        }

        let replyMessage = `${message.author.username} has drawn ${totalDraws} ${botMessage}'s - ${userHistory.join(", ")}`;
        
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

            return setImage(images)
          }
        };

        setImage = (images) => {
            // redis holds images for a week to ensure unique rolls
            let redisClient = redis.createClient(6379, '127.0.0.1');
            redisClient.on('error', (err) => {
                throw err
            })
            let image = images.images[Math.floor(Math.random()*images.images_count)];
            let redisKeys = [];
            redisClient.keys('*', (err, result) => {
                redisKeys = result;
            })

            // only rerolls if all the images haven't been drawn
            if (redisKeys.length < images.images_count) {
                // rerolls till it finds a unique image
                while (redisKeys.indexOf(image.link) !== -1) {
                    image = images.images[Math.floor(Math.random()*images.images_count)];
                    redisKeys.push(image.link);
                }
            }
            
            redisClient.set(image.link, image.title);
            // exire is in seconds
            redisClient.expire(image.link, 60 * 60 * 24 * 7);
            // tracks if a user has drawn
            redisClient.hset(message.author.username, 'isTrue', true)
            // prevents user from drawing till time exires, checked before request()
            // expire is in seconds
            redisClient.expire(message.author.username, 60 * 60 * 24)
            redisClient.quit();

            let userInfo = {
              discordInfo: message.author,
              imageInfo: image
            }
            
            return sendMessage(userInfo)
        }

        sendMessage = (userInfo) => {
            let image = userInfo.imageInfo
            // message that is sent back to the channel
            // e.g. `${discordMessage.author.username} drew ${image.title} from (${image.description}) ${image.link}`
            let replyMessage = `${message.author.username}'s ${botMessage} is ${image.title} (${image.description}) ${image.link}`;
      
            message.channel.send(replyMessage);
    
            db.createUser(userInfo);
        }

        
        let redisClient = redis.createClient(6379, '127.0.0.1');
            redisClient.on('error', (err) => {
                throw err
            })
        // checks to see if enough time has passed since the users last draw
        // based on exire time set in setImage()
        redisClient.hget(message.author.username, 'isTrue', (err, res) => {
            console.log(res)
            if (!res) {
                request(options, callback);
            } else {
                redisClient.ttl(message.author.username, (err, res) => {
                    let ttl = res;
                    let timer = {timeLeft: 0, unit: ''}

                    if (ttl > 3600) {
                        timer.timeLeft = parseInt(ttl / 60 / 60)
                        timer.unit = "hours"
                    } else if (ttl > 60) {
                        timer.timeLeft = parseInt(ttl / 60)
                        timer.unit = "minutes"
                    } else {
                        timer.timeLeft = ttl
                        timer.unit = "seconds"
                    }
                            
                    message.channel.send(`Must wait ${timer.timeLeft} ${timer.unit} before you can draw again.`);
                });
            }
            redisClient.quit();
        })
        
      },
      userTop: async (message) => {
        let user = await db.getUserByDiscordID(message.author)
        let history = JSON.parse(user.history);
        let topDraw = {name: [], count: 0, link: ''}
        let replyMessage;

        for (const [key, val] of Object.entries(history)) {
          if (val.count === topDraw.count) {
              topDraw.name.push(key)
          } else if (val.count > topDraw.count) {
              topDraw.name = [key]
              topDraw.count = val.count
              topDraw.link = val.link
          }
        }

        if (topDraw.name.length > 1) {
            replyMessage = `${message.author.username} top ${botMessage}'s are ${topDraw.name.join(', ')} at ${topDraw.count}.`;
        } else {
            replyMessage = `${message.author.username} top ${botMessage} is ${topDraw.name.join(', ')} at ${topDraw.count} ${topDraw.link}`;
        }

        message.channel.send(replyMessage);
      },
      userCurrent: async (message) => {
        let user = await db.getUserByDiscordID(message.author)
        let currentImage = user.currentImage
        let replyMessage = `${message.author.username} current ${botMessage} is ${currentImage}.`

        message.channel.send(replyMessage);
      }
}