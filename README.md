Image Bot
============

Installation
----------------

Clone the git repo to your local drive

    $ git clone https://github.com/chibitofu/discord-image-bot.git

Install project npm modules 

    $ npm install

Setup
-----

Make sure to add .env file to .gitignore or it will be uploaded to github for everyone to see. Create .env file and add your Discord bot token to it. e.g. echo "TOKEN=your-discord-token-goes-here" >> .env
Store anything you want to keep private in the .env file. e.g. imgur albums, api keys,

Run bot locally using $ node app.js (Will need to restart the server to see any updates to files. Look up nodemon for automatic server restarts on file changes.)

config.json - stores any settings or values in one place. Optionally add this to .gitignore to keep these private. Edit config.json as needed.

events.json - stores event dates (Months start at 0 due to Date() formatting)

I use channel ID's to designate where the bot works. You can use channel names if the bot will be available for public use. Have the Discord server admin create or edit a channel in the Discord server to the channel name you designated for the bot. Alternatively no channel authentication is required if the bot is to be used in any channel.

*This bot will require permission to send and read messages*

Features
--------

- Interface with Imgur Api to pull an image from an album
- Assign to specific channels on a Discord server
- Set time delay between image requests for individual users
- Store user image history in database
- Create events to be able to automatically use alternate albums

Current supported commands
--------------------------
!ping - Gets an image and posts it to the channel.
!ping history - Returns a list of names of previous pulled images.
!ping current - Returns the users current image.
!ping top - Returns the image that the user has drawn the most.
!ping help - Lists all bot commands in the channel.

- *The command is the word that the bot listens for, default is 'ping'*
- *The prefix and command can be set in the config.json file, default is '!'*
- *A prefix is not required but recommended to increase uniqueness.*
- *Message is the description for the image e.g. Warchief.*

How to add events
-----------------
**Using addEvent() function**
In app.js > eventInit
Use the addEvent() function to add new events on server startup.
Takes in 4 parameters, 1 required 3 optional.
- Required "event name"
- Optional "days before event as an integer"
- Optional "Days after event as an integer"
- Optional "Date of event as MM-DD-YYYY format"
Events will be written in the events.json file.
*If no event date is listed, then the function uses the moment-holiday module to try and find the date. If it cannot, no event will be added.*

**Manually**
*This has to be done after the server has started and will be reset if the server restarts.*
Open events.json
Events are divided by months. Months are using 0 index e.g. January is 0.
Add the date of the event to the month object. Day is the key, event name is the value.
e.g. 

    "1": {
            "14": "valentine's day"
    }

List the event on multiple days to have the even album in use for that time period.
Then open event.js and look for the variable eventAlbums.
Add the link to the Imgur album here.
By default a .env file is used for privacy purposes, but you can put the Imgur album link in here directly. The album link should be just the unique sequence e.g. PMo1OHg

Resources
---------

Discord.js guide - https://discordjs.guide/creating-your-bot
Discord.js Documentation - https://discord.js.org/#/docs/main/stable/general/welcome
Discord.js github - https://github.com/discordjs/discord.js 
dotenv Documentation - https://www.npmjs.com/package/dotenv

*Servers are referred to as Guilds in the Discord api*

Example methods
---------------

*See https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584 for a more comprehensive list.*

 listens for when a message is sent client.on('message', message=> { console.log(message); });

 listens if a message has been edited client.on('messageUpdate', (oldMessage, newMessage) => { console.log(${oldMessage} was edited to ${newMessage}); });

listens in channel for typing client.on('typingStart', (channel, user) => { console.log(${user} is typing in ${channel}); });

listens for updates to pins in a channel client.on('channelPinsUpdate', (channel, time) => { console.log(Pins were updated in ${channel} at ${time}); });

listens for changes to a channel ex. name client.on('channelUpdate', (oldChannel, newChannel) => { console.log(${oldChannel} was updated to ${newChannel}); });

listens for when the websocket has closed client.on('disconnect', event => { console.log('The websocket has closed and will not attempt to reconnect.') });

listens for when the client has encountered an error client.on('error', error => { console.log(error); });

listens for when a new user joins the server client.on('guildMemberAdd', member => { console.log(${member.tag} has joined the server); });

Example message properties. message.guild = Server the message was sent on. Some properties include name, id, members, channels and roles. message.author = User who sent the message. Some properties include name and id. message.channel = Channel that the message was posted in. Some properties include id, name, nsfw, and type. message.content = Conent of the message. message.mentions = Any mentiosn that were included in the message ex. @everyone.

Example message object
----------------------

Message { channel: TextChannel { type: 'text', deleted: false, id: '69527975585906688', name: 'general', position: 0, parentID: undefined, permissionOverwrites: Collection [Map] {}, topic: '', nsfw: false, lastMessageID: '662453018691633163', lastPinTimestamp: null, rateLimitPerUser: 0, guild: Guild { members: [Collection], channels: [Collection], roles: [Collection], presences: [Collection], deleted: false, available: true, id: '69527975585906688', name: 'Chibitofu', icon: '40dde2134c201602673b4762a39401df', splash: null, region: 'us-west', memberCount: 6, large: false, features: [], applicationID: null, afkTimeout: 300, afkChannelID: null, systemChannelID: null, embedEnabled: undefined, verificationLevel: 1, explicitContentFilter: 0, mfaLevel: 0, joinedTimestamp: 1578006530808, defaultMessageNotifications: 'ALL', ownerID: '60702139420258304', _rawVoiceStates: Collection [Map] {}, emojis: [Collection] }, messages: Collection [Map] { '662453018691633163' => [Circular] }, _typing: Map {} }, deleted: false, id: '662453018691633163', type: 'DEFAULT', content: '!ping', author: User { id: '60702139420258304', username: 'chibitofu', discriminator: '9861', avatar: '6fcf5e9ce731ce36d5181d68afed6e1a', bot: false, lastMessageID: '662453018691633163', lastMessage: [Circular] }, member: GuildMember { guild: Guild { members: [Collection], channels: [Collection], roles: [Collection], presences: [Collection], deleted: false, available: true, id: '69527975585906688', name: 'Chibitofu', icon: '40dde2134c201602673b4762a39401df', splash: null, region: 'us-west', memberCount: 6, large: false, features: [], applicationID: null, afkTimeout: 300, afkChannelID: null, systemChannelID: null, embedEnabled: undefined, verificationLevel: 1, explicitContentFilter: 0, mfaLevel: 0, joinedTimestamp: 1578006530808, defaultMessageNotifications: 'ALL', ownerID: '60702139420258304', _rawVoiceStates: Collection [Map] {}, emojis: [Collection] }, user: User { id: '60702139420258304', username: 'chibitofu', discriminator: '9861', avatar: '6fcf5e9ce731ce36d5181d68afed6e1a', bot: false, lastMessageID: '662453018691633163', lastMessage: [Circular] }, joinedTimestamp: 1436647161149, _roles: [], serverDeaf: false, serverMute: false, selfMute: undefined, selfDeaf: undefined, voiceSessionID: undefined, voiceChannelID: undefined, speaking: false, nickname: null, lastMessageID: '662453018691633163', lastMessage: [Circular], deleted: false }, pinned: false, tts: false, nonce: '662453018544832512', system: false, embeds: [], attachments: Collection [Map] {}, createdTimestamp: 1578011507438, editedTimestamp: null, reactions: Collection [Map] {}, mentions: MessageMentions { everyone: false, users: Collection [Map] {}, roles: Collection [Map] {}, _content: '!ping', _client: Client { _events: [Object], _eventsCount: 6, _maxListeners: 10, options: [Object], rest: [RESTManager], dataManager: [ClientDataManager], manager: [ClientManager], ws: [WebSocketManager], resolver: [ClientDataResolver], actions: [ActionsManager], voice: [ClientVoiceManager], shard: [ShardClientUtil], users: [Collection], guilds: [Collection], channels: [Collection], presences: Collection [Map] {}, user: [ClientUser], readyAt: 2020-01-03T00:31:47.119Z, broadcasts: [], pings: [Array], _timeouts: [Set], _intervals: [Set] }, _guild: Guild { members: [Collection], channels: [Collection], roles: [Collection], presences: [Collection], deleted: false, available: true, id: '69527975585906688', name: 'Chibitofu', icon: '40dde2134c201602673b4762a39401df', splash: null, region: 'us-west', memberCount: 6, large: false, features: [], applicationID: null, afkTimeout: 300, afkChannelID: null, systemChannelID: null, embedEnabled: undefined, verificationLevel: 1, explicitContentFilter: 0, mfaLevel: 0, joinedTimestamp: 1578006530808, defaultMessageNotifications: 'ALL', ownerID: '60702139420258304', _rawVoiceStates: Collection [Map] {}, emojis: [Collection] }, _members: null, _channels: null }, webhookID: null, hit: null, _edits: [] }