var ApiStatic = {Servers: {}, Featured: {},};

[	"https://mastodon.uno",
	"https://livellosegreto.it",
	"https://sociale.network",
	"https://mastodon.social",
].forEach(function(Serv){
	ApiStatic.Servers[Serv] = {ServerSoftware: "Mastodon"};
});

[	"https://misskey.social",
	"https://misskey.io"
].forEach(function(Serv){
	ApiStatic.Servers[Serv] = {ServerSoftware: "Misskey"};
});

//[	"https://pixelfed.uno",
//	"https://pixelfed.social"
//].forEach(function(Serv){
//	ApiStatic.Servers[Serv] = {ServerSoftware: "Pixelfed"};
//});

ApiStatic.Featured.Servers = [];
Object.keys(ApiStatic.Servers).forEach(function(Url){
	var Serv = ApiStatic.Servers[Url];
	Serv.Type = 'Server';
	Serv.Url = Url;
	ApiStatic.Featured.Servers.push(Serv);
});
