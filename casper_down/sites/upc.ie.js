var moment = require('moment');
var util = require('../lib/util');


function innerSteps(day) {
    var steps = [];
    for (var i = 0; i < 24; i += 3) {
        var item = {
            starton_click: util.format('#hours li:nth-child(%d)', i + 1),
            waitfor_selector: '#slot_container .timeslot',
            endwith: {
                label: day + '_' + i,
                store: ['file']
            }
        };
        steps.push(item);
    }
    return steps;
}

var config = {
    url: 'http://tv-guide.upc.ie/TV/',

    loaded: '#slot_container .timeslot',

    timeout: 10000,

    pageSettings: {},

    path: '/mnt/snapshots',

    steps: (function() {
        var steps = [];
        for (var i = 0; i < 7; i++) {
            var day = moment().add('days', i).format('YYYY-MM-DD');
            var item = {
                starton_click: util.format('.day .date[href="#%sT"]', day),
                waitfor_selector: '#slot_container .timeslot',
                steps: innerSteps(day)
            };
            steps.push(item);
        }
        return steps;
    })()

};


module.exports = config;