var moment = require('moment');
var util = require('../lib/util');

function scroll(label) {
    var steps = [];
    for (var i = 0; i < 10; i++) {
        var item = {
            starton_scroll: [0, 3200 * i],
            wait: 5000 * (i + 1),
            onready: {
                label: label + '_' + i,
                store: ['file', 'image']
            }
        };
        steps.push(item);
    }
    return steps;
}

function selectDay(region) {
    var steps = [];
    for (var i = 0; i < 7; i++) {
        var item = {
            starton_click: util.format('#day-nav li:nth-child(%d) a', i + 1),
            waitfor_selector: '#epg-grid',
            // steps: scroll(region + '_' + i)
            reload: true,
            onready: {
                label: region + '_' + i,
                store: ['file']
            }
        };
        steps.push(item);
    }
    return steps;
}

var config = {
    url: 'http://tv.sky.com/tv-guide',
    timeout: 2000,
    path: '/mnt/snapshots',
    pageSettings: {
        loadImages: false,
        width: 4500,
        height: 32000
    },

    steps: (function() {
        var steps = [];
        for (var i = 0; i < 93; i++) {
            var item = {
                starton_click: util.format('#region-nav li:nth-child(%d) a', i + 1),
                waitfor_selector: '#epg-grid',
                steps: selectDay(i)
            };
            steps.push({
                starton_click: util.format('#region-nav li.selected a'),
                waitfor_selector: '#region-nav',
            });
            steps.push(item);
        }
        return steps;
    })()

};


module.exports = config;