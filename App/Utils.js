function ForceList(Item) {
	return (Array.isArray(Item) ? Item : [Item]);
};

function RndId() {
	return `${Date.now()}${Math.random() + Math.random()}`;
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
		console[{l: "log", e: "error"}[Status.toLowerCase()]](Data);
	};
};

function IsObj(Item) {
	return typeof(Item) == 'object';
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
	if (Array.isArray(TreesOld)) {
		var ListNew = [];
		ForceList(TreesOld).forEach(function(TreeOld){
			ListNew.push(JsonTransformCycleB(TreeOld, SchemaNew, NodeNew, TypeOld));
		});
		return ListNew;
	} else {
		return JsonTransformCycleB(TreesOld, SchemaNew, NodeNew, TypeOld);
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
					if (KeyObj === '__Eval__') {
						eval(KeyOld[KeyObj]);
					} else
					if (KeyObj === '__EvalSet__') {
						TreeNew[KeyNew] = eval(KeyOld[KeyObj]);
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
