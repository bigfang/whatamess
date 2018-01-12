var util = require('../lib/util');

function innerSteps(iter) {
    var steps = [];
    for (var i = 0; i < 26; i++) {
        var item = {
            starton_click: iter % 2 === 0 ? '.dynContent .chainesPagin .next' : '.dynContent .chainesPagin .prev',
            wait: 1000,
            onready: {
                label: iter + '_' + i,
                store: ['file']
            }
        };
        steps.push(item);
    }
    return steps;
}

var config = {
    url: 'http://www.mycanal.fr/guide/grille/',

    loaded: '#programmes .dynContent',

    timeout: 10000,

    pageSettings: {},

    path: '/mnt/snapshots',

    steps: (function() {
        var steps = [];
        for (var i = 0; i < 7; i++) {
            var item = {
                starton_click: '#programmes .rightPager a',
                wait: 2000,
                steps: innerSteps(i),
                onready: {
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