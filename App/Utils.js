function ForceList(Item) {
	return (Array.isArray(Item) ? Item : [Item]);
};

function RndId() {
	return `${Date.now()}${Math.random() + Math.random()}`;
};
function RndHtmlId(Tag) {
	return `Rnd-${Tag}-${RndId().replace('.', '-')}`;
};

function FuncName(Fun) {
	if (Fun) {
		Fun = Fun.toString();
		var Name = Fun.split(' ')[1].split('(')[0].split('{')[0];
		var Hash = Fun.hashCode();
		return `f:${Name} (${Fun.hashCode()})`;
	};
};

function CallFun(f, a, b, c, d) {
	if (typeof(f) === 'function') {
		f(a, b, c, d);
	};
};

function LogDebug(Data, Status) {
	if (Debug) {
		var Caller;
		if (!Status) {
			Status = 'l';
		};
		for (var i=0; i<Data.length; i++) {
			try {
				Data[i] = JSON.parse(Data[i]);
			} catch(Ex){};
		};
		try {
			var Caller = LogDebug.caller;
		} catch(Ex){};
		console[{l: "log", e: "error"}[Status.toLowerCase()]](FuncName(Caller), Data);
	};
};

function IsObj(Item) {
	return typeof(Item) === 'object';
};

function ExtrimObj(Obj) {
	Obj = structuredClone(Obj);
	Object.keys(Obj).forEach(function(Key){
		Obj[Key] = undefined;
	});
	return Obj;
};

function UrlObj(Val, NetData) {
	if (IsObj(Val)) {
		return Val;
	} else
	if (typeof(Val) === 'string') {
		if (ApiCache.Urls[Val]) {
			return ApiCache.Urls[Val];
		} else {
			// TODO: fetch from Internet if key missing in cache
		};
	};
};

function B64Obj(Obj) {
	return btoa(JSON.stringify(Obj));
};
function UnB64Obj(Obj) {
	return JSON.parse(atob(Obj));
};

// https://stackoverflow.com/a/7616484
String.prototype.hashCode = function() {
	var hash = 0, i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	};
	return Number(hash).toString(16).padStart(2, 0);
};
