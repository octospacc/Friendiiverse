var ApiStatic = {Servers: {}, Featured: {},};
["https://mastodon.uno", "https://mastodon.social",].forEach(function(Serv){
	ApiStatic.Servers[Serv] = {Software: "Mastodon"};
});
["https://misskey.social",].forEach(function(Serv){
	ApiStatic.Servers[Serv] = {Software: "Misskey"};
});
ApiStatic.Featured.Servers = [];
Object.keys(ApiStatic.Servers).forEach(function(Serv){
	ApiStatic.Featured.Servers.push({
		Url: `${Serv}`,
	});
});
