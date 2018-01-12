var moment = require('moment');
var util = require('../lib/util');
 
function innerSteps() {
    var steps = [];
	for (var i = 0; i < 23; i++) {
		var item = {
			starton_dollorClick:'.guide_top_controls .guide_slide_right',
			waitfor_selector: 'body'
		};
		steps.push(item);
	}
    return steps;
}

var config = {
    url: 'http://whatson.freesat.co.uk/tvguide/',
	
	wait:5000,
	path: '/mnt/snapshots',
    timeout: 10000,
	pageSettings: {
       height: 12000
    },

    steps: (function() {
		var day = moment().add('hour').format('YYYY-MM-DD HH');
        var steps = [];
		
		var item = {
			starton_dollorClick:'.guide_days #guideDay8',
			waitfor_selector: 'body',
			steps: innerSteps()
		};
		steps.push(item);
		wait:10000;
		
		//from the last day to the second day
        for (var i = 0; i < 161; i++) {            
			var item = {
				starton_dollorClick:'.guide_top_controls .guide_slide_left',
				wait:10000
			};			
            steps.push(item);
        }	
		
		item = {
				starton_dollorClick:'.guide_top_controls .guide_slide_left',
				wait:10000,
				onready:{
					label: day,
					store: ['file']
					}
				};
		steps.push(item);
		/*
		for (var i = 0; i < 30000; i++) {
			var item = {
				starton_dollorClick:util.format('.guide_listingrow .guide_day_wrapper .guide_listing .gl_popup:eq(%d)', i),
				waitfor_selector: '#guide_popup_header',
				onready:{
					label: i,
					selector: '#guide_popup',
					store: ['file', 'image']
				}
			};			
			steps.push(item);
		}
		*/
		//from the second day to the first day
		for (var i = 0; i < 20; i++) {            
			var item = {
				starton_dollorClick:'.guide_top_controls .guide_slide_left',
				wait:10000
			};			
            steps.push(item);
        }	
		
		item = {
				starton_dollorClick:'.guide_top_controls .guide_slide_left',
				wait:10000,
				onready:{
					label: day,
					store: ['file']
					}
				};
		steps.push(item);
		/*
		for (var i = 0; i < 30000; i++) {
			var item = {
				starton_dollorClick:util.format('.guide_listingrow .guide_day_wrapper .guide_listing .gl_popup:eq(%d)', i),
				waitfor_selector: '#guide_popup_header',
				onready:{
					label: i,
					selector: '#guide_popup',
					store: ['file', 'image']
				}
			};			
			steps.push(item);
		}
		*/
        return steps;
    })()
};

module.exports = config;