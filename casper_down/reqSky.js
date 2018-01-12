var request = require('request');
var moment = require('moment');
var fs = require('fs');
var util = require('util');
var thenjs = require('thenjs');


var regions = [{"headend":"4101-19","title":"Atherstone HD"},{"headend":"4097-19","title":"Atherstone SD"},{"headend":"4101-12","title":"Border England HD"},{"headend":"4097-12","title":"Border England SD"},{"headend":"4102-36","title":"Border Scotland HD"},{"headend":"4098-36","title":"Border Scotland SD"},{"headend":"4103-65","title":"Brighton HD"},{"headend":"4099-65","title":"Brighton SD"},{"headend":"4101-3","title":"Central Midlands HD"},{"headend":"4097-3","title":"Central Midlands SD"},{"headend":"4104-34","title":"Channel Isles HD"},{"headend":"4100-34","title":"Channel Isles SD"},{"headend":"4101-20","title":"East Midlands HD"},{"headend":"4097-20","title":"East Midlands SD"},{"headend":"4101-2","title":"Essex HD"},{"headend":"4097-2","title":"Essex SD"},{"headend":"4101-24","title":"Gloucester HD"},{"headend":"4097-24","title":"Gloucester SD"},{"headend":"4102-35","title":"Grampian HD"},{"headend":"4098-35","title":"Grampian SD"},{"headend":"4101-7","title":"Granada HD"},{"headend":"4097-7","title":"Granada SD"},{"headend":"4103-70","title":"Henley On Thames HD"},{"headend":"4099-70","title":"Henley On Thames SD"},{"headend":"4103-43","title":"HTV Wales HD"},{"headend":"4099-43","title":"HTV Wales SD"},{"headend":"4101-4","title":"HTV West HD"},{"headend":"4097-4","title":"HTV West SD"},{"headend":"4103-63","title":"HTV West / Thames Valley HD"},{"headend":"4099-63","title":"HTV West / Thames Valley SD"},{"headend":"4101-29","title":"Humber HD"},{"headend":"4097-29","title":"Humber SD"},{"headend":"4101-1","title":"London HD"},{"headend":"4097-1","title":"London SD"},{"headend":"4101-18","title":"London / Essex HD"},{"headend":"4097-18","title":"London / Essex SD"},{"headend":"4103-66","title":"London / Thames Valley HD"},{"headend":"4099-66","title":"London / Thames Valley SD"},{"headend":"4103-64","title":"London Kent HD"},{"headend":"4099-64","title":"London Kent SD"},{"headend":"4101-11","title":"Meridian East HD"},{"headend":"4097-11","title":"Meridian East SD"},{"headend":"4103-68","title":"Meridian North HD"},{"headend":"4099-68","title":"Meridian North SD"},{"headend":"4101-5","title":"Meridian South HD"},{"headend":"4097-5","title":"Meridian South SD"},{"headend":"4101-10","title":"Meridian South East HD"},{"headend":"4097-10","title":"Meridian South East SD"},{"headend":"4103-45","title":"Merseyside HD"},{"headend":"4099-45","title":"Merseyside SD"},{"headend":"4101-21","title":"Norfolk HD"},{"headend":"4097-21","title":"Norfolk SD"},{"headend":"4103-62","title":"North East Midlands HD"},{"headend":"4099-62","title":"North East Midlands SD"},{"headend":"4101-8","title":"North West Yorkshire HD"},{"headend":"4097-8","title":"North West Yorkshire SD"},{"headend":"4101-26","title":"North Yorkshire HD"},{"headend":"4097-26","title":"North Yorkshire SD"},{"headend":"4104-33","title":"Northern Ireland HD"},{"headend":"4100-33","title":"Northern Ireland SD"},{"headend":"4103-71","title":"Oxford HD"},{"headend":"4099-71","title":"Oxford SD"},{"headend":"4104-50","title":"Republic of Ireland HD"},{"headend":"4100-50","title":"Republic of Ireland SD"},{"headend":"4103-41","title":"Ridge Hill HD"},{"headend":"4099-41","title":"Ridge Hill SD"},{"headend":"4103-61","title":"Scarborough HD"},{"headend":"4099-61","title":"Scarborough SD"},{"headend":"4102-37","title":"Scottish East HD"},{"headend":"4098-37","title":"Scottish East SD"},{"headend":"4102-38","title":"Scottish West HD"},{"headend":"4098-38","title":"Scottish West SD"},{"headend":"4103-60","title":"Sheffield HD"},{"headend":"4099-60","title":"Sheffield SD"},{"headend":"4101-28","title":"South Lakeland HD"},{"headend":"4097-28","title":"South Lakeland SD"},{"headend":"4103-72","title":"South Yorkshire HD"},{"headend":"4099-72","title":"South Yorkshire SD"},{"headend":"4103-69","title":"Tees HD"},{"headend":"4099-69","title":"Tees SD"},{"headend":"4101-9","title":"Thames Valley HD"},{"headend":"4097-9","title":"Thames Valley SD"},{"headend":"4101-27","title":"Tring HD"},{"headend":"4097-27","title":"Tring SD"},{"headend":"4101-13","title":"Tyne HD"},{"headend":"4097-13","title":"Tyne SD"},{"headend":"4101-25","title":"West Anglia HD"},{"headend":"4097-25","title":"West Anglia SD"},{"headend":"4103-67","title":"West Dorset HD"},{"headend":"4099-67","title":"West Dorset SD"},{"headend":"4101-6","title":"Westcountry HD"},{"headend":"4097-6","title":"Westcountry SD"},{"title":"More."}]

// var url = 'http://tv.sky.com/programme/channel/2304/2014-06-25/0.json';

var allChannels = {};

var regionUrls = [];
for (var i = 0; i < regions.length; i++) {
	var regionUrl = util.format('http://tv.sky.com/channel/index/%s', regions[i].headend);
	regionUrls.push({
		'headend': regionUrl,
		'title': regions[i].title
	});
}


var urls = [];

thenjs.eachSeries(regionUrls, function(cont, url) {
	// console.log(url);
	request.get(url.headend, function(err, resp, body) {
		if (err) throw err;
		if (!err && resp.statusCode == 200) {
			var name = url.headend.split('/')[5];
			// fs.writeFile('./snapshots/' + name + '.json', body, function(err) {
			// 	if (err) throw err;
			// 	console.log('Save ' + name);
			// 	cont();
			// });
			var j = JSON.parse(body).init.channels;
			j.forEach(function(i) {
				var tmp = i.c;
				tmp.push(i.t);
				allChannels[i.c[0]] = tmp;
				allChannels['headend'] = url.title;
			});
			console.log(name);
			cont();
		}
	});
}).then(function(cont) {
	var channels = Object.getOwnPropertyNames(allChannels);
	for (var idx = 0; idx < channels.length; idx++) {
		var code = channels[idx];
		for (var i = 0; i < 7; i++) {
			var day = moment().add('days', i).format('YYYY-MM-DD');
			for (var count = 0; count < 4; count++) {
				url = util.format('http://tv.sky.com/programme/channel/%d/%s/%d.json', code, day, count);
				urls.push(url);
				// console.log(url);
			}
		}
	}
	cont();
}).eachSeries(urls, function(cont, url) {
	// console.log(url);
	var id = url.split('/')[5];
	request.get(url, function(err, resp, body) {
		if (err) throw err;
		if (!err && resp.statusCode == 200) {
			var name = url.split('/').slice(5).join('_');
			var content = JSON.parse(body);
			content.name = allChannels[id][4];
			content.no = allChannels[id][1];
			content.headend = allChannels['headend'];
			fs.writeFile('/mnt/snapshots/' + name, JSON.stringify(content), function(err) {
				if (err) throw err;
				console.log('Save ' + name);
				cont();
			});
		}
	});
});