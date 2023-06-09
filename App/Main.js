var Tasker = {};
var Persist = {Servers: {}, Sources: {}, Identities: {},};
var Present = structuredClone(Persist);

Persist.__Set__ = function __Set__() {
	// set value to own object
	// set value to Present object too
	// rewrite own object into cookies
};

Present.__Set__ = function __Set__() {
	// like Persist but only set value to own object
};

var ApiCache = {
	__Store__(Data, Path) {
		eval(`ApiCache${JPath(Path)} = Data;`);
	},
	__UrlStore__(Data) {
		ApiCache.__Store__(Data, `Urls['${Data.Url}']`);
	},
	Urls: {},
};

Assets.__ = function __(Name) {
	if (Name in Assets) {
		if (Assets[Name].startsWith('data:')) {
			return Assets[Name];
		} else {
			return `./Assets/${Assets[Name]}`;
		};
	};
};

Strings.__ = function __(Name) {
	// TODO: Handle arbitrary nestation
	if (Name in Strings) {
		if (Strings[Name]['en']) { // TODO{ Select this language from user config
			return Strings[Name]['en'];
		} else {
			return Strings[Name].en;
		};
	};
};

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
	ForceList(First).forEach(function(Fun){
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

function HtmlAssign(Id, Data) {
	Array.from(document.getElementsByClassName(Id)).forEach(function(El){
		HtmlAssignPropper(El, Data);
	});
	Array.from(document.getElementById(Id).querySelectorAll(`*:not([class~="${Id}"])`)).forEach(function(El){
		if (El.dataset.assign) {
			HtmlAssignPropper(El, Data);
		};
	});
};
function HtmlAssignPropper(El, Data) {
	El.dataset.assign.trim().split(' ').forEach(function(Att){
		var Toks = Att.split('=');
		var Key = Toks[0].trim();
		var Val = eval(`Data.${Toks[1]}`);
		if (Val !== undefined) {
			if (Key === 'src') {
				Val = MkReqUrl(Val);
			};
			El[Key] = Val;
		};
	});
};

function TransNetCall(Data, FromSource, DestType, Proc) {
	Data.CallOld = Data.Call;
	Data.CallFineOld = Data.CallFine;
	Data.CallFailOld = Data.CallFail;
	NetCall(_.merge(Data, {
		//Call: function(Res){ CallFun(Data.Call, Res); },
		CallFine: function(Res){
			Res.responseJsonOld = Res.responseJson;
			Res.responseJson = ApiTransform(Res.responseJson, FromSource, DestType);
			CallFun(Data.CallFineOld, Res);
		}, //CallFail: function(Res){ CallFun(Data.CallFail, Res); },
	}), Proc);
};

function DisplayProfile(Profile) {
	Profile = UrlObj(Profile, DisplayProfile);
	if (Profile) {
		var Window = MkWindow({className: "Profile"});
		Window.innerHTML += Templating.ViewProfile(Profile);
		DoAsync(FetchNotes, FillTimeline, Profile);
	};
};

function FetchNotes(Profile, Proc) {
	var Soft = Profile.ServerSoftware;
	var Method = Profile.Type == 'Server'
		? ApiEndpoints.ServerTimeline[Soft]
		: ApiEndpoints.FetchNotes[Soft](Profile);
	var Endp = Method;
	var Method = Endp.Method || Endp;
	NetCall({Target: UrlBase(Profile.Url), Method: Method, Data: Endp.Data, CallFine: function(Res){
		var Notes = ApiTransform(Res.responseJson, Soft, 'Note');
		LogDebug(Notes, 'l');
		Tasker[Res.Proc[0]].Return(Notes);
	}}, Proc);
};

function FetchMastodon(Proc) {
	//if (UseFakeApi) {
	//	ResFetchMastodon({responseJson: [FakeApi.Mastodon.Status], Proc: Proc});
	//} else {
		NetCall({Target: "Mastodon", Method: "GET timelines/public", CallFine: ResFetchMastodon}, Proc);
	//};
};
function ResFetchMastodon(Res) {
	var Notes = ApiTransform(Res.responseJson, 'Mastodon', 'Note');
	LogDebug(Notes, 'l');
	Tasker[Res.Proc[0]].Return(Notes);
};

function FillTimeline(Notes) {
	Notes.forEach(function(Note){
		ApiCache.__UrlStore__(Note.Profile);
		Root.lastChild.innerHTML += Templating.ViewNote(Note);
	});
};

function DisplayThread(Note) {
	var Window = MkWindow({className: "Thread"});
	//Window.innerHTML += Templating.ViewNote(Note);
};

function FillHome() {
	var Window = MkWindow({className: "Gallery"});
	var Categories = ApiStatic.Featured;
	//_.forOwn(Categories, function(CategoryVal, Category){
	Object.keys(Categories).forEach(function(Category){
		Window.innerHTML += `<h2>Featured ${Category}</h2><ul></ul>`;
		Categories[Category].forEach(function(Profile){
			ApiCache.Urls[Profile.Url] = Profile;
			var Rnd = RndHtmlId();
			Window.querySelector('ul').innerHTML += `<li id="${Rnd}">
				${Templating.ViewProfile(Profile, {Name: Profile.Url})}
			</li>`;
			var Endp = ApiEndpoints.ServerInfo[Profile.ServerSoftware];
			var Method = Endp.Method || Endp;
			TransNetCall({Target: Profile.Url, Method: Method, Data: Endp.Data, CallFine: function(Res){
				HtmlAssign(Rnd, Res.responseJson);
				_.merge(ApiCache.Urls[Profile.Url], Res.responseJson);
			}}, Profile.ServerSoftware, 'Profile');
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
	</ul>
</div>
`;
*/

function ComposeNote() {
	var Window = MkWindow();
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
	MkWindow().innerHTML = `
		<h2>Settings</h2>
		<h3>Misc</h3>
		<p>
			Language: ${MkSelectMenu([{innerHTML: "en"}, {innerHTML: "it"},]).outerHTML}
		</p>
		<p>
			Theme:
		</p>
		<p>
			<label>Wait <input type="number"/> seconds after clicking send for a note to be sent</label>
		</p>
		<h3>Identities</h3>
		${MkListMenu(Present.Identities, ElsCfg.ListMenu.FullControl).outerHTML}
		<h3>Sources</h3>
		${MkListMenu(Present.Sources, ElsCfg.ListMenu.FullControl).outerHTML}
		<h3>Data</h3>
		<p>
			<button>Import User Data</button>
			<button>Export User Data</button>
		</p>
		<p>
			<label><input type="checkbox"/> Persist cache on app reload</label>
		</p>
	`;
};

FillHome();
CoverView.remove();
