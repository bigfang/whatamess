var casper = require('casper').create({
	pageSettings: {
		loadImages: false,
		loadPlugins: false,
	}
}),
	fs = require('fs');

var url = casper.cli.get(0),
	name = casper.cli.get(1) || 'x',
	timeout = casper.cli.get(2) || 30000;

casper.start(url, function() {
	this.wait(timeout, function() {
		fs.write(name + '.html', this.getHTML(), 'w', function(err) {
			if (err)
				console.error(err.message);
		});
		this.capture(name + '.png'); // debug
	});
});

casper.run(function() {
	this.echo('Done.').exit();
});