var Tasker = {};
var ApiCache = {Notes: {}, Profiles: {},};

function DoAsync(First, Then, Data) {
	var Job = RndId();
	Tasker[Job] = {
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
		Tasker[Job][Task] = {};
		Tasker[Job].Remains += 1;
		//Fun(Proc, Data);
		Data ? Fun(Data, Proc) : Fun(Proc);
	});
	// Continuosly check when First functs completed
	Tasker[Job].Interval = setInterval(function(Job, Then){
		if (Tasker[Job].Remains <= 0) {
			clearInterval(Tasker[Job].Interval);
			// Call all Then functs
			ForceList(Then).forEach(function(Fun){
				Fun(Tasker[Job].Result);
			});
			delete Tasker[Job];
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

/*
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
*/

function MakeWindow(Attrs) {
	var Window = document.createElement('div');
	if (Attrs) {
		Object.keys(Attrs).forEach(function(Attr){
			Window[Attr] = Attrs[Attr];
		});
	};
	Window.className += ' Window';
	Root.appendChild(Window);
	return Window;
};

function DisplayProfile(Profile) {
	var Window = MakeWindow({className: "Profile"});
	Window.innerHTML += `<div class="" style="display: inline-block;">
		<a href="${Profile.Url}">
			<div>
				<img class="" src="${Profile.Banner}"/>
			</div>
			<div>
				<img class="" src="${Profile.Icon}"/>
				${Profile.Name}
			</div>
		</a>
	</div>`;
	DoAsync(FetchMastodon, FillTimeline);
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
	Tasker[Res.Proc[0]].Return(Notes);
};

function FillTimeline(Notes) {
	Notes.forEach(function(Note){
		Root.lastChild.innerHTML += `<div class="View Note">
			<a href="${Note.Profile.Url}" onclick="DisplayProfile(ApiCache.Profiles['${Note.Profile.Url}']); return false;">
				<img class="Profile Icon" src="${Note.Profile.Icon}"/>
				${Note.Profile.Name}
			</a>
			${Note.Content}
			<a href="${Note.Url}">${Note.Time}</a>
		</div>`;
	});
};

function FetchFeatured(Proc) {
	//if (UseFakeApi) {
		var Featured = FakeApi.Friendiiverse.Featured;
		Object.values(Featured).forEach(function(Profiles){
			Profiles.forEach(function(Profile){
				ApiCache.Profiles[Profile.Url] = Profile;
			});
		});
		Tasker[Proc[0]].Return(Featured);
	//} else {
		
	//};
};

function FillFeatured(Categories) {
	var Window = MakeWindow({className: "Gallery"});
	Object.values(Categories).forEach(function(Profiles){
		Profiles.forEach(function(Profile){
			Window.innerHTML += `<div>
				<a href="${Profile.Url}" onclick="DisplayProfile(ApiCache.Profiles['${Profile.Url}']); return false;">
					<div>
						<img src="${Profile.Banner}"/>
					</div>
					<div>
						<img src="${Profile.Icon}"/>
						${Profile.Name}
					</div>
				</a>
			</div>`;
		});
	});
};

/*
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
*/

DoAsync(FetchFeatured, FillFeatured);
CoverView.remove();
