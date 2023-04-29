#!/usr/bin/env node
const Host = '0.0.0.0';
const Port = 44380;
const Blacklist = [];
const Whitelist = [];

require('./node_modules/cors-anywhere/lib/cors-anywhere').createServer({
	originBlacklist: Blacklist,
	originWhitelist: Whitelist,
	redirectSameOrigin: true,
	httpProxyOptions: {xfwd: false},
}).listen(Port, Host, function() {
	console.log(`Running proxy on ${Host}:${Port}`);
});
