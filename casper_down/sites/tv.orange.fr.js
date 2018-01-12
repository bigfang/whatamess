var moment = require('moment');
var util = require('../lib/util');


var config = {
    url: 'http://programme-tv.orange.fr/grille/chaines-tv/en-ce-moment.html',
	
	wait:5000,
	path: '/mnt/snapshots',
    timeout: 100000,
	pageSettings: {
    },

    steps: (function() {		
        var steps = [];	

		for(var i = 1; i < 11; i++)	{
			var item = {
				starton_click:util.format('#gridContainer #grid div:nth-child(%d) .pafMultiAccordionTitle', i),
				wait:3000
			};
			steps.push(item);
		}
		
		for (var i = 1; i < 60; i++) {			
			var day = moment().add('day', i-1).format('YYYY-MM-DD HH');		
			var item = {
				starton_click:'.ctrlRemoteSlotChoice.next .ctrlRemoteSlotLabel',
				wait:3000,
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