// events.js
// check to see if there are any events happening
module.exports = {
    checkEvent: function() {
        const eventsJSON = require('./events.json');
        // values are imgur album hashes e.g. GD6p5Fi
        let eventAlbums = {  test: undefined,
                            valentines: process.env.VALENTINES_ALBUM,
                            starwars: undefined,
                            halloween: undefined,
                            thanksgiving: process.env.THANKSGIVING_ALBUM,
                            christmas: process.env.CHRISTMAS_ALBUM
                        };

        let date = new Date();
        let day = date.getDate().toString();
        let month = date.getMonth().toString();
        let eventName = eventAlbums[eventsJSON[month][day]];
        
        if (eventName) {
            return eventName;
        } else {
            return undefined;
        }
    }
}