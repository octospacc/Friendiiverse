var CurrTasks = {};

var CurrentTimeline = [];
var CurrentTimelineExp = 0;

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

function WaitTasks(First, Then, Data) {
	var Run = RndId();
	CurrTasks[Run] = {Remains: 0};
	ForceList(First).forEach(function(Fun, Data){
		var Task = RndId();
		var Proc = [Run, Task];
		CurrTasks[Run].Remains += 1;
		Data ? Fun(Proc, Data) : Fun(Proc);
	});
	CurrTasks[Run].Interval = setInterval(function(Run, Then){
		if (CurrTasks[Run].Remains === 0) {
			clearInterval(CurrTasks[Run].Interval);
			ForceList(Then).forEach(function(Fun){
				Fun(CurrTasks[Run].Result);
			});
		};
	}, 50, Run, Then);
};

function HttpCodeGood(Code) {
	var Unit = String(Code)[0];
	if (['1', '2', '3'].includes(Unit)) {
		return true;
	} else
	if (['4', '5'].includes(Unit)) {
		return false;
	};
};

function ApiCall(Data, Proc) {
	// Data = {Target: "Friendica", Method: "...", Data: {}, Call: (), CallFine: (), CallFail: ()}
	var Req = new XMLHttpRequest();
	Req.Proc = Proc;
	Req.onloadend = function(){
		var Status = String(this.status);
		if (Data.Call) {
			Data.Call(this);
		}
		if (HttpCodeGood(this.status)) {
			if (Data.CallFine) {
				Data.CallFine(this);
			};
			LogDebug([this.status, this.responseText], 'l');
		} else {
			if (Data.CallFail) {
				Data.CallFail(this);
			};
			LogDebug([this.status, this.responseText], 'e');
		};
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

function FetchMastodon(Proc) {
	return ApiCall({Target: "Mastodon", Method: "timelines/public", CallFine: function(Res){
		//console.log(JSON.parse(Res.responseText)[0])
		var New = [ TransParsers.Mastodon.Status( JSON.parse(Res.responseText)[0] ) ];
		console.log(New)
		//return [
		//	TransParsers.Mastodon.Status(JSON.parse(Res.responseText)[0])
		//];
		//CurrentTimeline = CurrentTimeline.concat([TransParsers.Mastodon.Status(JSON.parse(Res.responseText)[0])]);
		//CurrentTimelineExp -= 1;
		CurrTasks[Res.Proc[0]].Remains -= 1;
		// TODO: store data in global object
		CurrTasks[Res.Proc[0]].Result = New;
	}}, Proc);
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
		<li onclick="WaitTasks(FetchMastodon, FillTimeline);">${MastodonUrl}</li>
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
