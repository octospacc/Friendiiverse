// Transform JSON tree into a new using a template schema

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

// DEVNOTE: Unsafe, should check for colliding "__" keys from input tree and act accordingly
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
		if (TreesOld && SchemaNew && NodeNew) {
			return JsonTransformCycleB(TreesOld, SchemaNew, NodeNew, TypeOld);
		};
	};
};

function JsonTransformCycleB(TreeOld, SchemaNew, NodeNew, TypeOld) {
	var TreeNew = structuredClone(NodeNew);
	if (SchemaNew.__All__) {
		//TreeNew.__All__ = structuredClone(SchemaNew.__All__);
		//console.log(1, '__All__')
		//_.forOwn(TreeNew, function(KeyNewVal, KeyNew){
		//	console.log(1, KeyNew)
		//});
		_.forOwn(SchemaNew.__All__, function(Val, Key){
			//console.log(1, Key)
			TreeNew[Key] = structuredClone(Val);
		});
	};
	_.forOwn(TreeNew, function(KeyNewVal, KeyNew){
		//if (KeyNew === '__All__') {
		//	console.log(1, KeyNew)
		//	_.forOwn(KeyOld, function(KeyObjVal, KeyObj){});
		//};
		if (KeyNewVal.__All__ && !KeyNewVal[TypeOld]) {
			//console.log(3, KeyNewVal.__All__)
			KeyNewVal[TypeOld] = KeyNewVal.__All__;
		};
		if (KeyNewVal[TypeOld]) {
			var KeyOld = KeyNewVal[TypeOld];
			var ObjOld = TreeOld[KeyOld];
			if (IsObj(KeyOld)) {
			// Object in NodeNew / Deep nested children in TreeOld
				_.forOwn(KeyOld, function(KeyObjVal, KeyObj){
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
					TreeNew[KeyNew] = JsonTransformB(ObjOld, SchemaNew, SchemaNew[TreeNew[KeyNew].__], TypeOld);
				} else {
					TreeNew[KeyNew] = ObjOld;
				};
			};
		};
	});
	TreeNew.__TreeOld__ = TreeOld;
	return TreeNew;
};
