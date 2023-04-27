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
	if (SchemaNew.__All__) {
		TreeNew.__All__ = CopyObj(SchemaNew.__All__);
	};
	_.forOwn(TreeNew, function(KeyNewVal, KeyNew){
		if (KeyNewVal[TypeOld]) {
			var KeyOld = KeyNewVal[TypeOld];
			var ObjOld = TreeOld[KeyOld];
			if (IsObj(KeyOld)) {
			// Object in NodeNew / Deep nested children in TreeOld
				_.forOwn(KeyOld, function(KeyObjVal, KeyObj){
					//if (KeyObj === '__All__') { //NOTE: This must be handle as directly nested, not deep (how?)
					//	console.log('__All__')
					//	//TreeNew.__All__ = SchemaNew.__All__;
					//};
					if (KeyObj === '__Eval__') {
						eval(KeyObjVal);
					} else
					if (KeyObj === '__EvalSet__') {
						TreeNew[KeyNew] = eval(KeyObjVal);
					} else
					if (KeyObj === '__Set__') {
						TreeNew[KeyNew] = KeyObjVal;
					} else
					if (KeyObj === '__OldOr__') {
						var Keys = KeyObjVal;
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
			// Value in NodeNew / Direct children in TreeOld
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
