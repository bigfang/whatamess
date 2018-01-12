var moment = require('moment');
var util = require('../lib/util');

function programeSteps(name) {
    var steps = [];
    for (var i = 0; i < 10; i++) {
        for (var m = 0; m < 15; m++) {
            var t = (i + 1) * 100 + m;
            var item = {
                starton_click: util.format('.tvg_listings_epg_grid .tvg_listings_channel:nth-child(%d) .tvg_listings_channel_all_progs .tvg_listings_channel_progbox:nth-child(%d) a', i + 2, m + 1),
                wait: 1000,
                onready: {
                    label: name + '_' + t + '##_PROGRAM',
                    // selector: '#tvgShowDetailsWrapper #tvgShowDetailsInnerWrapper',
                    store: ['file']
                }
            };
            steps.push(item);
        }
    }
    return steps;
}

function selectRegion(name) {
    var steps = [];
    for (var i = 0; i < 16; i++) {
        var item = {
            starton_dollorSelect: [util.format('#tvgRegionSelect>option:eq(%d)', i), '#tvgListingPrefsPopUp .tvg_myprefs_ok'],
            wait: 1000,
            onready: {
                label: name + '_' + i,
                store: ['file']
            },
            // steps: clickSteps(i)
        };
        steps.push(item);
    }
    return steps;
}

// direction 1: next  0: previous
function innerSteps(day, direction) {
    var steps = [];
    steps.push({
        starton_click: 'body',
        waitfor_selector: '#tvg_listings_epg_box.tvg_listings_epg_grid',
        steps: selectRegion(day + '_0')
    });
    for (var i = 0; i < 7; i++) {
        var item = {
            starton_click: direction ? '.tvg_listings_nav_next [title]' : '.tvg_listings_nav_previous [title]',
            wait: 1000,
            // onready: {
            //     label: day + '_' + (i + 1),
            //     store: ['file', 'image']
            // },
            // steps: programeSteps(day + (i + 1))
            steps: selectRegion(day + '_' + (i + 1))
        };
        steps.push(item);
    }
    return steps;
}

function clickSteps() {
    // var steps = innerSteps(moment().format('YYYY_MM_DD_HH'), 1);
    var steps = []; // debug
    for (var i = 0; i < 60; i++) {
        var day = moment().add('hour', (i + 1) * 4).format('YYYY_MM_DD_HH');
        var item = {
            starton_click: '.tvg_listings_nav_later [title]',
            // waitfor_selector: '#tvg_listings_epg_box.tvg_listings_epg_grid',
            wait: 1000,
            steps: innerSteps(day, i % 2)
        };
        steps.push(item);
    }
    return steps;
}

var config = {
    url: 'http://www.freeview.co.uk/whats-on/tv-guide',
    // loadImages: true,
    loaded: '#tvg_listings_epg_box.tvg_listings_epg_grid',
    path: '/mnt/snapshots',
    timeout: 10000,
    pageSettings: {},
    // onready: {
    //     label: moment().format('YYYY_MM_DD'),
    //     store: ['file', 'image']
    // },

    steps: clickSteps()
};


module.exports = config;