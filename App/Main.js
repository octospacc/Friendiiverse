var Persist = {Servers: {}, Sources: {}, Identities: {},};
var Present = CopyObj(Persist);
var Tasker = {};
var ApiCache = {Urls: {},};

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
	DoAsync(FetchMastodon, FillTimeline, Profile);
};

function FetchNotes(Profile, Proc) {
	
};

function FetchMastodon(Proc) {
	if (UseFakeApi) {
		ResFetchMastodon({responseJson: [FakeApi.Mastodon.Status], Proc: Proc});
	} else {
		ApiCall({Target: "Mastodon", Method: "timelines/public", CallFine: ResFetchMastodon}, Proc);
	};
};
function ResFetchMastodon(Res) {
	var Notes = ApiTransform(Res.responseJson, 'Mastodon', 'Note');
	LogDebug(Notes, 'l');
	Tasker[Res.Proc[0]].Return(Notes);
};

function FillTimeline(Notes) {
	Notes.forEach(function(Note){
		Root.lastChild.innerHTML += `<div class="View Note">
			<a href="${Note.Profile.Url}" onclick="DisplayProfile(ApiCache.Urls['${Note.Profile.Url}']); return false;">
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
				ApiCache.Urls[Profile.Url] = Profile;
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
				<a href="${Profile.Url}" onclick="DisplayProfile(ApiCache.Urls['${Profile.Url}']); return false;">
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
`;
*/

function ComposeNote() {
	var Window = MakeWindow();
	Window.innerHTML += `
		<h2>Compose</h2>
		<p>Posting in: [Channel]</p>
		<textarea style="width: 100%; height: 20em;"></textarea>
		<p>
			<button onclick="PostNote(this.parentNode.parentNode.querySelector('textarea').value);">Note!</button>
		</p>
	`;
};
function PostNote(Text) {
	Obj = ExtrimObj(ApiSchema.Note);
	Obj.Content = Text;
	// Find out current profile and destination channel to do a proper net request
};

function ManageSettings() {
	MakeWindow().innerHTML = `
		* Sources
		* Identities
		* Data Import/Export
		* Cache Persistance
	`;
};

DoAsync(FetchFeatured, FillFeatured);
CoverView.remove();
