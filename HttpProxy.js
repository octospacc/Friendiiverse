#!/usr/bin/env node
const Host = '0.0.0.0';
const Port = 44380;
const Blacklist = [];
const Whitelist = [];

//const cors_proxy = require('./lib/cors-anywhere');
/*cors_proxy*/
require('./node_modules/cors-anywhere/lib/cors-anywhere').createServer({
	originBlacklist: Blacklist,
	originWhitelist: Whitelist,
	removeHeaders: ['cookie', 'cookie2'],
	redirectSameOrigin: true,
}).listen(Port, Host, function() {
	console.log(`Running proxy on ${Host}:${Port}`);
});
