var moment = require('moment');

function innerTrigger() {
    var trigger = [];
    for (var i = 0; i < 5; i += 1) {
        var item = {
            label: i,
            starton_click: '#paginator .rightarrow a',
            wait: 3000
        };
        trigger.push(item);
    }
    return trigger;
}

var config = {
    url: 'https://tvguide-prod.canaldigital.no/?lang=sv_SE',

    loaded: '#main',

    timeout: 5000,

    path: '/mnt/snapshots',

    trigger: function() {
        var trigger = [];
        for (var i = 0; i < 7; i++) {
            var day = moment().add('days', i).format('YYYY-MM-DD');
            var item = {
                label: day,
                starton_click: '#channel-nav .nav-controls .next',
                wait: 3000,
                trigger: innerTrigger()
            };
            trigger.push(item);
        }
        return trigger;
    }()

};


module.exports = config;