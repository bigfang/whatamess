var arg = process.argv.slice(2);
var config = require('./sites/' + arg);

console.info('%s', JSON.stringify(config, null, 2));
