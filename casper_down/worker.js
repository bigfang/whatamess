var casper = require('casper').create({
    verbose: true,
    logLevel: "info",
    pageSettings: {
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Iron/31.0.1700.0 Chrome/31.0.1700.0'
    },
    viewportSize: {
        width: 800,
        height: 600
    },
    clientScripts: []
});


var utils = require('utils'),
    fs = require('fs');

var config = require('./sites/' + casper.cli.get(0));

casper.options.pageSettings.loadImages = config.pageSettings.loadImages || false;
casper.options.viewportSize.width = config.pageSettings.width || 800;
casper.options.viewportSize.height = config.pageSettings.height || 600;
casper.options.clientScripts = config.pageSettings.clientScripts || [];


function parseParameters(steps) {
    var ret = {
        label: steps.label || '',
        onready: steps.onready,
        endwith: steps.endwith,
        reload: steps.reload,
        start: undefined,
        startFn: undefined,
        wait: undefined,
        waitFn: undefined
    };

    for (var k in steps) {
        var len = k.split('_').length - 1;
        var flg = k.split('_')[0];
        var cmd = k.split('_')[len];

        // console.log(len, flg, cmd)  // debug
        if (flg === 'starton') {
            ret.start = steps[k];
            ret.startFn = cmd;
        } else if (flg === 'waitfor') {
            ret.wait = steps[k];
            ret.waitFn = 'waitFor' + cmd[0].toUpperCase() + cmd.slice(1);
        } else if (flg === 'waitwhile') {
            ret.wait = steps[k];
            ret.waitFn = 'waitWhile' + cmd[0].toUpperCase() + cmd.slice(1);
        } else if (flg === 'waituntil') {
            ret.wait = steps[k];
            ret.waitFn = 'waitUntil' + cmd[0].toUpperCase() + cmd.slice(1);
        } else if (flg === 'wait') {
            ret.wait = steps[k];
            ret.waitFn = 'wait';
        }
    }
    return ret;
}

function fetch(steps) {
    steps.forEach(function(steps) {
        var params = parseParameters(steps);

        casper.then(function() {
            if (params.startFn === 'click') {
                if (this.exists(params.start)) {
                    this.click(params.start);
                    if (params.reload) {
                        this.reload(function() {
                            this.echo(this.getCurrentUrl());
                        });
                    }
                    browse.call(this, steps, params);
                }
            } else if (params.startFn === 'dollorClick' || params.startFn === 'dollarClick') {
                if (this.dollorExists(params.start)) {
                    this.dollorClick(params.start);
                    if (params.reload) {
                        this.reload(function() {
                            this.echo(this.getCurrentUrl());
                        });
                    }
                    browse.call(this, steps, params);
                }
            } else if (params.startFn === 'scroll') {
                this.scrollTo(params.start[0], params.start[1]);
                browse.call(this, steps, params);
            } else if (params.startFn === 'dollorSelect') {
                this.dollorSelect(params.start[0], params.start[1]);
                browse.call(this, steps, params);
            }

        });
    });
}

function browse(steps, params) {
    this[params.waitFn](
        params.wait,
        function() {
            if (steps.hasOwnProperty('onready')) {
                save.call(this, params, 'onready');
            }
            if (steps.hasOwnProperty('steps')) {
                fetch.call(this, steps.steps);
            }
            if (steps.hasOwnProperty('endwith')) {
                save.call(this, params, 'endwith');
            }
        },
        function onTimeout() { },
        config.timeout
    );
}

var thruput = 0;
var filecounter = 0;

function save(params, property) {

    fs.write('worker.log', JSON.stringify(params) + '\n', 'w+', function(err) {
        if (err)
            console.log(err.message);
    });

    var self = this;
    var path = utils.format('%s/%s_%s', config.path, casper.cli.get(0), params[property].label);
    var region = params[property].selector;
    params[property].store.forEach(function(act) {
        if (act === 'file') {
            var urlNode = '\n<!--' + config.url + '-->';
            thruput += self.getHTML(region).length + urlNode.length;
            fs.write(path + '.html', self.getHTML(region) + urlNode, 'w', function(err) {
                if (err)
                    console.log(err.message);
            });
            filecounter++;
        } else if (act === 'image') {
            if (region)
                self.captureSelector(path + '.png', region);
            else
                self.capture(path + '.png');
        }
    });
}


casper.dollorExists = function(selector) {
    return this.evaluate(function(selector) {
        if ($(selector).length === 0) {
            return false;
        } else {
            return true;
        }
    }, selector);
};

casper.dollorClick = function(selector) {
    return this.evaluate(function(selector) {
        if ($(selector).length > 0) {
            $(selector).click();
        }
    }, selector);
};

casper.dollorSelect = function(selector, click) {
    return this.evaluate(function(selector) {
        $(selector).each(function(i) {
            $(this).removeAttr('selected');
        });
        $(selector).attr('selected', true);
        if (click)
            $(click).click();
    }, selector, click);
};


casper.start(config.url);

if (config.loaded) {
    casper.waitForSelector(config.loaded, function() {
        if (config.hasOwnProperty('onready')) {
            save.call(this, config, 'onready');
        }
    });
} else {
    casper.wait(3000, function() {
        if (config.hasOwnProperty('onready')) {
            save.call(this, config, 'onready');
        }
    });
}

fetch(config.steps);

casper.run(function() {
    this.echo('thruput:' + thruput + ",filecount:" + filecounter);
    fs.write('../WebCrawler/stat/' + casper.cli.get(0) + '.msg.txt', thruput + ',' + filecounter, 'w', function(err) {
        if (err)
            console.log(err.message);
    });

    this.echo('Finished.');
    this.exit();
});

casper.on('error', function(msg, backtrace) {
    throw new Error(msg);
});