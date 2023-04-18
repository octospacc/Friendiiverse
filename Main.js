NoscriptView.remove();

var CurrentTimeline = [];
var CurrentTimelineExp = 0;

var FakeApi = {};
FakeApi.F = {};
FakeApi.My = {};

function LogDebug(Data, Status) {
	if (Debug) {
		for (var i=0; i<Data.length; i++) {
			try {
				Data[i] = JSON.parse(Data[i]);
			} catch(_){};
		};
		console[{l: "log", e: "error"}[Status]](Data);
	};
};

function ApiCall(Data) {
	// Data = {Target: "Friendica", Method: "...", Data: {}, Call: (), CallFine: (), CallFail: ()}
	var Req = new XMLHttpRequest();
	//Req.onreadystatechange = function(){
	Req.onloadend = function(){
		//if (this.readyState == 4) {
			var Status = String(this.status);
			if (Data.Call) {
				return Data.Call(this);
			}
			if (['1', '2', '3'].includes(Status[0])) {
				if (Data.CallFine) {
					return Data.CallFine(this);
				};
				LogDebug([Status, this.responseText], 'l');
			} else
			if (['4', '5'].includes(Status[0])) {
				if (Data.CallFail) {
					return Data.CallFail(this);
				};
				LogDebug([Status, this.responseText], 'e');
			};
		//};
	};
	if (Data.Target == 'Mastodon') {
		Req.open('GET', `${MastodonUrl}/api/v1/${Data.Method}`, true);
	};
	if (Data.Target == 'Friendica') {
		Req.open('GET', `${FriendicaUrl}/api/${Data.Method}.json`, true);
		Req.setRequestHeader('Authorization', `Basic ${btoa(FriendicaCredentials)}`);
	};
	Req.send();
};

/*
function MastodonParse(Data, Type) {
	var Trans = {
		Status(Data) {
			return JsonTranslate(Data, TransSchemas.Mastodon.Status);
		},
	}
	return Trans[Type](Data);
};
*/

/*
function DisplayMastodonTimeline(Timeline) {
	ApiCall({Target: "Mastodon", Method: Timeline, CallFine: function(Res){
		DataView.innerHTML = Res.responseText;
		JSON.parse(DataView.innerHTML).forEach(function(Item){
			TimelineView.innerHTML += `<div class=PostView>
				<a href="${Item.external_url}">${Item.created_at}</a>
				${Item.friendica_author.url}
				${Item.friendica_html}
			</div>`;
		});
	}});
};
*/

function DisplayFriendicaTimeline(Timeline) {
	ApiCall({Target: "Friendica", Method: Timeline, CallFine: function(Res){
		DataView.innerHTML = Res.responseText;
		JSON.parse(DataView.innerHTML).forEach(function(Item){
			var Title = Item.friendica_title ? `<h2>${Item.friendica_title}</h2>` : '';
			TimelineView.innerHTML += `<div class=PostView>
				<a href="${Item.external_url}">${Item.created_at}</a>
				${Item.friendica_author.url}
				${Title}
				${Item.friendica_html}
			</div>`;
		});
	}});
};

function FetchMastodon() {
	return ApiCall({Target: "Mastodon", Method: "timelines/public", CallFine: function(Res){
		//console.log(JSON.parse(Res.responseText)[0])
		console.log([TransParsers.Mastodon.Status(JSON.parse(Res.responseText)[0])])
		//return [
		//	TransParsers.Mastodon.Status(JSON.parse(Res.responseText)[0])
		//];
		CurrentTimeline = CurrentTimeline.concat([TransParsers.Mastodon.Status(JSON.parse(Res.responseText)[0])]);
		CurrentTimelineExp -= 1;
	}});
};

function FillTimeline(Notes) {
	console.log('notes', Notes)
	Notes.forEach(function(Note){
		TimelineView.innerHTML += `<div class=PostView>
			<a href="${Note.Url}">${Note.Time}</a>
			${Note.Author}
			${Note.Content}
		</div>`;
	});
};

PlazasView.innerHTML = `
<div>
	<h3>Featured</h3>
	<ul>
		<li onclick="DisplayFriendicaTimeline('statuses/networkpublic_timeline');">Federation</li>
		<li onclick="DisplayFriendicaTimeline('statuses/public_timeline');">${FriendicaUrl}</li>
		<li onclick="var CurrentTimelineExp = 1; FetchMastodon(); /*FillTimeline();*//*DisplayMastodonTimeline('timelines/public');*/">${MastodonUrl}</li>
	</ul>
</div>
<div>
	<h3>Categories</h3>
	<ul>
		<li>Testing</li>
		<li>#fediverse</li>
	</ul>
</div>
`;

