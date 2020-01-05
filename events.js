// events.js
// check to see if there are any events happening
module.exports = {
    checkEvent: function() {
        const eventsJSON = require('./events.json');
        // values are imgur album hashes e.g. GD6p5Fi
        let eventAlbums = {  "test": undefined,
                            "valentines day": process.env.VALENTINES_ALBUM,
                            "starwars": undefined,
                            "halloween": undefined,
                            "thanksgiving": process.env.THANKSGIVING_ALBUM,
                            "christmas": process.env.CHRISTMAS_ALBUM
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
    },
    
    // eventDate format YYYY-MM-DD e.g. valentines day would be 2020-02-14
    // leave eventDate blank to have the date looked up by the eventName using moments-holiday.js
    // e.g. eventNames; christmas, mothers day, new years eve
    addEvent: async function(eventName, daysBefore = 0, daysAfter = 0, eventDate = false) {
        var moment = require('moment-holiday');
        var fs = require('fs');
        const fsPromises = fs.promises;
        var eventsJSON = JSON.parse((await fsPromises.readFile('./events.json')).toString());
        eventName = eventName.toLowerCase();
        var dateArr = [];
        
        if (!eventDate) { eventDate = moment().holiday(eventName); };

        var startEvent = new Date(moment(eventDate).subtract(daysBefore, 'days').format('MM-DD-YYYY'));
        var endEvent = new Date(moment(eventDate).add(daysAfter, 'days').format('MM-DD-YYYY'));

        while (startEvent <= endEvent) {
            var month = (moment(startEvent).format("M") - 1).toString();
            var day = moment(startEvent).format("D").toString();
            dateArr.push(moment(startEvent).format('ddd DD-MM'));
            var newDate = startEvent.setDate(startEvent.getDate() + 1);
            startEvent = new Date(newDate);

            if (!eventsJSON[month][day]) {
                eventsJSON[month][day] = eventName;
            }
        }

        await fsPromises.writeFile('./events.json', JSON.stringify(eventsJSON, null, 4), function(err) {
            if (err) throw err + "problem writing";
        });
    },

    initializeEventsJson: async function() {
        var fs = require('fs');
        const fsPromises = fs.promises;
        var eventsJSON = {"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{},"8":{},"9":{},"10":{},"11":{}};

        await fsPromises.writeFile('./events.json', JSON.stringify(eventsJSON, null, 4), function(err) {
            if (err) throw err + "Problem creating";
        });
    }
}