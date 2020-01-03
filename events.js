// events.js
// check to see if there are any events happening
module.exports = {
    checkEvent: function() {
        let eventsData = require('./events.json');
        let date = new Date();
        let day = date.getDate().toString();
        let month = date.getMonth().toString();
        let event = eventsData[month][day];
        
        if (event) {
            return eventsData.events[event];
        } else {
            return undefined;
        }
    }
}