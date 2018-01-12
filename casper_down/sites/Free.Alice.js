var moment = require('moment');
var util = require('../lib/util');

var config = {
    url: 'http://robssatellitetv.com/frenchtvguide.htm',
	
	wait:5000,
	path: '/mnt/snapshots',
    timeout: 100000,
	pageSettings: {
    },

    steps: (function() {		
        var steps = [];
		
		//choose days
		for (var i = 1; i < 11; i++) {
			var day = moment().add('day', i-1).format('YYYY-MM-DD HH');	
			
			//choose hours
			for (var j = 1; j < 26; j++) {								
				var item = {
					starton_click:util.format('#programme .ligneProgramme:nth-child(%d) .zappingDroit a', j),
					wait:3000
				};			
				steps.push(item);
			}

			var item = {
				onready:{
					label: day,
					store: ['file']
				}
			};			
			steps.push(item);
		}	
		
        return steps;
    })()
};

module.exports = config;