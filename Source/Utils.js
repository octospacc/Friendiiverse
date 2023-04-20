function ForceList(Item) {
	return (Array.isArray(Item) ? Item : [Item]);
};

function RndId() {
	return `${Date.now()}${Math.random()}`;
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
		var KeyNew = ((typeof(SchemaCurr) == 'object' && KeyOld in SchemaCurr) ? SchemaCurr[KeyOld] : KeyOld);
		if (typeof(Content) == 'object' && Content !== null) {
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
	var TreeNew = NodeNew;
	Object.keys(NodeNew).forEach(function(KeyNew){
		if (TypeOld in NodeNew[KeyNew]) {
			var KeyOld = NodeNew[KeyNew][TypeOld];
			var ObjOld = TreeOld[KeyOld];
			if (typeof(KeyOld) == 'object') {
			// Deep nested children in TreeOld
				
			} else {
			// Direct children in TreeOld
				if (typeof(ObjOld) == 'object') {
					TreeNew[KeyNew] = JsonTransformB(ObjOld, SchemaNew, SchemaNew[KeyNew], TypeOld);
				} else {
					TreeNew[KeyNew] = ObjOld;
				};
			};
		};
	});
	return TreeNew;
};
