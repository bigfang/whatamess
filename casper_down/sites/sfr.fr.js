var util = require('../lib/util');


function innerSteps(day) {
    var steps = [];
    for (var i = 0; i < 3; i++) {
        var item = {
            starton_click: '.charge_chaines',
            wait: 2000,
        };
        steps.push(item);
    }
    return steps;
}

var config = {
    url: 'http://tv.sfr.fr/epg/soiree/',

    loaded: '#epg_menu .contentShadow',

    timeout: 10000,

    pageSettings: {},

    path: '/mnt/snapshots',

    steps: (function() {
        var steps = [];

        for (var j = 0; j < 3; j++) {
            var item = {
                starton_click: '.charge_chaines',
                wait: 2000,
            };
            steps.push(item);
        }

        for (var i = 0; i < 21; i++) {
            var item = {
                starton_dollorSelect: [util.format('#selDateEPG>option:eq(%d)', i)],
                wait: 2000,
                // steps: innerSteps(),
                endwith: {
                    label: i,
                    store: ['file']
                }
            };
            steps.push(item);
        }
        return steps;
    })()

};


module.exports = config;