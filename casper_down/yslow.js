var casper = require('casper').create({
    verbose: true,
    logLevel: "info",
    pageSettings: {
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Iron/31.0.1700.0 Chrome/31.0.1700.0'
        },
        viewportSize: {
            width: 4500,
            height: 32000
    }
});

var fs = require('fs');


casper.start('http://tv.sky.com/tv-guide/');

casper.then(function() {
    this.click('#day-nav li:nth-child(1) a');
    this.reload();
    this.wait(5000);
    fs.write('./snapshots/1.html', this.getHTML(), 'w', function(err) {
        if (err)
            console.log(err.message);
    });
});

casper.then(function() {
    this.click('#day-nav li:nth-child(2) a');
    this.reload();
    this.wait(5000);
    fs.write('./snapshots/2.html', this.getHTML(), 'w', function(err) {
        if (err)
            console.log(err.message);
    });
});

casper.then(function() {
    this.click('#day-nav li:nth-child(3) a');
    this.reload();
    this.wait(5000);
    fs.write('./snapshots/3.html', this.getHTML(), 'w', function(err) {
        if (err)
            console.log(err.message);
    });
});

casper.then(function() {
    this.click('#day-nav li:nth-child(4) a');
    this.reload();
    this.wait(5000);
    fs.write('./snapshots/4.html', this.getHTML(), 'w', function(err) {
        if (err)
            console.log(err.message);
    });
});

casper.then(function() {
    this.click('#day-nav li:nth-child(5) a');
    this.reload();
    this.wait(5000);
    fs.write('./snapshots/5.html', this.getHTML(), 'w', function(err) {
        if (err)
            console.log(err.message);
    });
});

casper.then(function() {
    this.click('#day-nav li:nth-child(6) a');
    this.reload();
    this.wait(5000);
    fs.write('./snapshots/6.html', this.getHTML(), 'w', function(err) {
        if (err)
            console.log(err.message);
    });
});


casper.run(function() {
    this.echo('Finished.');
    this.exit();
});