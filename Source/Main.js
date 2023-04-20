var CurrTasks = {};

function DoAsync(First, Then, Data) {
	var Job = RndId();
	CurrTasks[Job] = {
		Remains: 0,
		Return(Data) {
			this.Remains -= 1;
			this.Result = Data;
		},
	};
	// Call all First functs
	ForceList(First).forEach(function(Fun, Data){
		var Task = RndId();
		var Proc = [Job, Task];
		CurrTasks[Job][Task] = {};
		CurrTasks[Job].Remains += 1;
		//Fun(Proc, Data);
		Data ? Fun(Data, Proc) : Fun(Proc);
	});
	// Continuosly check when First functs completed
	CurrTasks[Job].Interval = setInterval(function(Job, Then){
		if (CurrTasks[Job].Remains <= 0) {
			clearInterval(CurrTasks[Job].Interval);
			// Call all Then functs
			ForceList(Then).forEach(function(Fun){
				Fun(CurrTasks[Job].Result);
			});
		};
	}, 50, Job, Then);
	return Job;
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
		try {
			this.responseJson = JSON.parse(this.responseText);
			this.responseLog = this.responseJson;
		} catch(Ex) {
			this.responseLog = this.responseText;
		};
		if (Data.Call) {
			Data.Call(this);
		};
		if (HttpCodeGood(this.status)) {
			LogDebug([this.status, this.responseLog], 'l');
			if (Data.CallFine) {
				Data.CallFine(this);
			};
		} else {
			LogDebug([this.status, this.responseLog], 'e');
			if (Data.CallFail) {
				Data.CallFail(this);
			};
		};
	};
	if (Data.Target == 'Mastodon') {
		Req.open('GET', `${MastodonUrl}/api/v1/${Data.Method}`, true);
	} else
	if (Data.Target == 'Friendica') {
		Req.open('GET', `${FriendicaUrl}/api/${Data.Method}.json`, true);
		Req.setRequestHeader('Authorization', `Basic ${btoa(FriendicaCredentials)}`);
	};
	Req.send();
};

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
	if (UseFakeApi) {
		ResFetchMastodon({responseJson: [FakeApi.Mastodon.Status], Proc: Proc});
	} else {
		ApiCall({Target: "Mastodon", Method: "timelines/public", CallFine: ResFetchMastodon}, Proc);
	};
};
function ResFetchMastodon(Res) {
	var Notes = TransParsers.Mastodon.Status(Res.responseJson);
	LogDebug(Notes, 'l');
	CurrTasks[Res.Proc[0]].Return(Notes);
};

function FillTimeline(Notes) {
	Notes.forEach(function(Note){
		TimelineView.innerHTML += `<div class="View Note">
			<a href="${Note.Author.Url}">
				<img class="Author Icon" src="${Note.Author.Icon}"/>
				${Note.Author.Name}
			</a>
			${Note.Content}
			<a href="${Note.Url}">${Note.Time}</a>
		</div>`;
	});
};

function FetchFeatured(Proc) {
	//if (UseFakeApi) {
		CurrTasks[Proc[0]].Return(FakeApi.Friendiiverse.Featured);
	//} else {
		
	//};
};

function FillFeatured(Categories) {
	Object.values(Categories).forEach(function(Channels){
		Channels.forEach(function(Channel){
			PlazasView.innerHTML += `<div>
				<a href="${Channel.Url}">
					<img class="" src="${Channel.Banner}"/>
					<img class="" src="${Channel.Icon}"/>
					${Channel.Name}
				</a>
			</div>`;
		});
	});
};

PlazasView.innerHTML = `
<div>
	<h3>Featured</h3>
	<ul>
		<li onclick="DisplayFriendicaTimeline('statuses/networkpublic_timeline');">Federation</li>
		<li onclick="DisplayFriendicaTimeline('statuses/public_timeline');">${FriendicaUrl}</li>
		<li onclick="DoAsync(FetchMastodon, FillTimeline);">
			<img src=""/>
			${MastodonUrl}
		</li>
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

DoAsync(FetchFeatured, FillFeatured);

