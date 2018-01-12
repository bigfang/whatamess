var util = require('../lib/util');


function innerSteps(day) {
    var steps = [];
    for (var i = 0; i < 6; i++) {
        var item = {
            starton_click: util.format('#menuhours.menuhours a:nth-child(%d)', i + 1),
            wait: 2000,
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
    url: 'http://www.service.bbox.bouyguestelecom.fr/services/epg/index_iframe.phtml',

    loaded: '#contents.content',

    timeout: 10000,

    pageSettings: {},

    path: '/mnt/snapshots',

    steps: (function() {
        var steps = [];
        for (var i = 0; i < 7; i++) {
            var item = {
                starton_click: util.format('#days_hours .menudays table tr td:nth-child(%d) a', i + 1),
                wait: 2000,
                reload: true,
                steps: innerSteps(i)
            };
            steps.push(item);
        }
        return steps;
    })()

};


module.exports = config;