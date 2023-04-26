var ApiStatic = {Servers: {}, Featured: {},};
["https://mastodon.uno", "https://mastodon.social",].forEach(function(Serv){
	ApiStatic.Servers[Serv] = {ServerSoftware: "Mastodon"};
});
["https://misskey.social",].forEach(function(Serv){
	ApiStatic.Servers[Serv] = {ServerSoftware: "Misskey"};
});
ApiStatic.Featured.Servers = [];
Object.keys(ApiStatic.Servers).forEach(function(Url){
	var Serv = ApiStatic.Servers[Url];
	Serv.Type = 'Server';
	Serv.Url = Url;
	ApiStatic.Featured.Servers.push(Serv);
});
