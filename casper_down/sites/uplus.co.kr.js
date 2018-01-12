var util = require('../node_lib/util');

var config = {
    url: 'http://www.uplus.co.kr/css/chgi/chgi/RetrieveTvContentsMFamily.hpi?mid=1036',
    timeout: 5000,
    path: './snapshots',
    loaded: '#CATEGORY',
    onready: {
        'label': '',
        'action': ['save', 'capture']
    },

    steps: [{
            starton_click: '#CATEGORY ul.cboth.desktop_area_box li:nth-child(1) a',
            waitfor_selector: '.accessibility_channel_fchange .tvcategory .cboth.desktop_area_box',
            endwith: {
                'label': 1,
                'action': ['save', 'capture']
            }
        }, {
            starton_click: '#CATEGORY ul.cboth.desktop_area_box li:nth-child(2) a',
            waitfor_selector: '.accessibility_channel_fchange .tvcategory .cboth.desktop_area_box',
            endwith: {
                'label': 2,
                'action': ['save', 'capture']
            }
        }
    ]
};


module.exports = config;