var moment = require('moment');
var util = require('../lib/util');

var config = {
    url: 'http://www.numericable.tv/guide-tv/',
	
	wait:5000,
	path: '/mnt/snapshots',
    timeout: 100000,
	pageSettings: {
    },

    steps: (function() {		
        var steps = [];
		
		//choose days
		for (var i = 1; i < 8; i++) {
			var item = {
				starton_click:util.format('.programsPart #jour_semaine li:nth-child(%d) a', i),
				wait:3000
			};
			steps.push(item);		
					
			//choose hours
			for (var j = 1; j < 6; j++) {
				var day = moment().add('day', j-1).format('YYYY-MM-DD HH');					
				var item = {
					starton_click:util.format('.programsPart #jour_semaine li:nth-child(1) .dayHours li:nth-child(%d) a', j),
					wait:3000
				};			
				steps.push(item);	

				//choose channels
				for(var m = 0; m < 42; m++) {
					var lab = i + " " + day + " " + m;
					var item = {
						starton_dollorClick:util.format('.chanelsPart .chanelsList ul li:eq(%d) a', m),
						wait:3000,
						onready:{
							label: lab,
							store: ['file']
						}
					};
					steps.push(item);	
				}				
			}		
		}	
		
        return steps;
    })()
};

module.exports = config;