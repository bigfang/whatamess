var moment = require('moment');
var util = require('../lib/util');


function mousewheel(lab) {
	var steps = [];
	for(var i = 0; i < 18; i++) {
		var item = {
		starton_scroll: [0, 500 + (i+1)*300],
		wait:3000,
		onready:{
				label: lab + " " + i,
				store: ['file']
				}
		};
		steps.push(item);
	}
	
	var item = {
		starton_dollorClick:'.arrowTop-overlay',
		wait:3000
	};			
	steps.push(item);
	
	return steps;
}

var config = {
    url: 'http://anywhere.virginmedia.com/tv-listings/',
	
	wait:5000,
	path: '/mnt/snapshots',
    timeout: 100000,
	pageSettings: {
    },

    steps: (function() {		
        var steps = [];
		
		//choose handend
		for (var j = 0; j < 17; j++) {
			var item = {
				starton_dollorClick:util.format('.epg-filter-region ul li:eq(%d) a', j),
				wait:10000
			};
			steps.push(item);		
		
			//get 7 days data
			//first choose which day's data to get
			for (var i = 1; i < 8; i++) {
				var day = moment().add('day', i-1).format('YYYY-MM-DD HH');		
				var lab = j + " " + day + " " + 0;
				var item = {
					starton_dollorClick:util.format('.header-bar-sections li:nth-child(%d) a', i),
					wait:3000,
					steps: mousewheel(lab),
					onready:{
						label: lab,
						store: ['file']
					}			
				};			
				steps.push(item);			
			}		
		}	
		
        return steps;
    })()
};

module.exports = config;