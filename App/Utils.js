function ForceList(Item) {
	return (Array.isArray(Item) ? Item : [Item]);
};

function RndId() {
	return `${Date.now()}${Math.random() + Math.random()}`;
};
function RndHtmlId(Tag) {
	return `Rnd-${Tag}-${RndId().replace('.', '-')}`;
};

function UrlBase(Url) {
	var Lower = Url.toLowerCase();
	var Domain = UrlDomain(Url);
	if (Lower.startsWith('http://')) return `http://${Domain}`;
	else
	if (Lower.startsWith('https://')) return `https://${Domain}`;
	else
	return `//${Domain}`;
};
function UrlDomain(Url) {
	return Url.split('//')[1].split('/')[0];
};

function LogDebug(Data, Status) {
	if (Debug) {
		if (!Status) {
			Status = 'l';
		};
		for (var i=0; i<Data.length; i++) {
			try {
				Data[i] = JSON.parse(Data[i]);
			} catch(_){};
		};
		console[{l: "log", e: "error"}[Status.toLowerCase()]](LogDebug.caller.toString().hashCode()
		/*Issue trying to get function name on Eruda... .split(' ')[1].split('(')[0]*/, Data);
	};
};

function IsObj(Item) {
	return typeof(Item) === 'object';
};

function CopyObj(Obj) {
	return JSON.parse(JSON.stringify(Obj));
};

function ExtrimObj(Obj) {
	Obj = CopyObj(Obj);
	Object.keys(Obj).forEach(function(Key){
		Obj[Key] = undefined;
	});
	return Obj;
};

function UrlObj(Val) {
	if (IsObj(Val)) {
		return Obj;
	} else
	if (typeof(Val) === 'string') {
		// TODO: fetch from Internet if key missing in cache
		return ApiCache.Urls[Val];
	};
};

function B64Obj(Obj) {
	return btoa(JSON.stringify(Obj));
};
function UnB64Obj(Obj) {
	return JSON.parse(atob(Obj));
};

// Transform JSON tree into a new using a template schema
// DEVNOTE: Unsafe, should check for colliding "__" keys from input tree and act accordingly
function JsonTransformA(TreesOld, SchemaCurr, SchemaRoot) {
	if (Array.isArray(TreesOld)) {
		var ListNew = [];
		ForceList(TreesOld).forEach(function(TreeOld){
			ListNew.push(JsonTransformCycleA(TreeOld, SchemaCurr, SchemaRoot));
		});
		return ListNew;
	} else {
		return JsonTransformCycleA(TreesOld, SchemaCurr, SchemaRoot);
	};
};
function JsonTransformCycleA(TreeOld, SchemaCurr, SchemaRoot) {
	var TreeNew = {};
	Object.keys(TreeOld).forEach(function(KeyOld){
		var Content = TreeOld[KeyOld];
		var KeyNew = ((IsObj(SchemaCurr) && KeyOld in SchemaCurr) ? SchemaCurr[KeyOld] : KeyOld);
		if (IsObj(Content) && Content !== null) {
			if (Array.isArray(Content)) {
			// Lists
			/*	var ListNew = [];
				Content.forEach(function(Value){
					ListNew.push(JsonTransform(Value, KeyNew));
				});
				TreeNew[KeyNew] = ListNew;*/
			} else {
			// Dicts
				// Strange bug, in this context we can't assign new value to child of the object, we use a variable
				NameKeyNew = KeyNew.__;
				if (!NameKeyNew) {
					NameKeyNew = KeyOld;
				};
				TreeNew[NameKeyNew] = JsonTransformA(Content, SchemaRoot[NameKeyNew], SchemaRoot);
				if (NameKeyNew !== KeyOld) {
					TreeNew[SchemaRoot[NameKeyNew].__] = TreeNew[NameKeyNew];
					delete TreeNew[NameKeyNew];
				};
			};
		} else {
		// Values
			TreeNew[KeyNew] = Content;
		};
	});
	return TreeNew;
};

function JsonTransformB(TreesOld, SchemaNew, NodeNew, TypeOld) {
	LogDebug([TreesOld, SchemaNew, NodeNew, TypeOld]);
	if (Array.isArray(TreesOld)) {
	// List of values
		var ListNew = [];
		ForceList(TreesOld).forEach(function(TreeOld){
			ListNew.push(JsonTransformCycleB(TreeOld, SchemaNew, NodeNew, TypeOld));
		});
		return ListNew;
	} else {
	// Object
		if (TreesOld) {
			return JsonTransformCycleB(TreesOld, SchemaNew, NodeNew, TypeOld);
		};
	};
};
function JsonTransformCycleB(TreeOld, SchemaNew, NodeNew, TypeOld) {
	var TreeNew = CopyObj(NodeNew);
	Object.keys(TreeNew).forEach(function(KeyNew){
		if (TypeOld in TreeNew[KeyNew]) {
			var KeyOld = TreeNew[KeyNew][TypeOld];
			var ObjOld = TreeOld[KeyOld];
			if (IsObj(KeyOld)) {
			// Object in SchemaNew / Deep nested children in TreeOld
				Object.keys(KeyOld).forEach(function(KeyObj){
					//if (SchemaNew.__All__) {
					//	TreeNew.__All__ = SchemaNew.__All__;
					//};
					if (KeyObj === '__Eval__') {
						eval(KeyOld[KeyObj]);
					} else
					if (KeyObj === '__EvalSet__') {
						TreeNew[KeyNew] = eval(KeyOld[KeyObj]);
					} else
					if (KeyObj === '__OldOr__') {
						var Keys = KeyOld[KeyObj];
						for (var i=0; i<Keys.length; i++) {
							var Key = TreeOld[Keys[i]];
							if (Key !== undefined) {
								TreeNew[KeyNew] = Key;
								return;
							};
						};
					};
				});
			} else {
			// Value in SchemaNew / Direct children in TreeOld
				if (IsObj(ObjOld)) {
					TreeNew[KeyNew] = JsonTransformB(ObjOld, SchemaNew, SchemaNew[KeyNew], TypeOld);
				} else {
					TreeNew[KeyNew] = ObjOld;
				};
			};
		};
	});
	TreeNew.__TreeOld__ = TreeOld;
	return TreeNew;
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
