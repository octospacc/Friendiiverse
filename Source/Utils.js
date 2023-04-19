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
function JsonTransform(TreeOld, SchemaCurr, SchemaRoot) {
	var TreeNew = {};
	Object.keys(TreeOld).forEach(function(KeyOld){
		var Content = TreeOld[KeyOld];
		var KeyNew = ((typeof(SchemaCurr) == 'object' && KeyOld in SchemaCurr) ? SchemaCurr[KeyOld] : KeyOld);
		if (typeof(Content) == 'object' && Content !== null) {
			if (Array.isArray(Content)) {
			// Lists
				var ListNew = [];
				Content.forEach(function(Value){
					ListNew.push(JsonTransform(Value, KeyNew));
				});
				TreeNew[KeyNew] = ListNew;
			} else {
			// Dicts
				if (!KeyNew.__) {
					KeyNew.__ = KeyOld;
				};
				TreeNew[KeyNew.__] = JsonTransform(Content, SchemaRoot[KeyNew.__], SchemaRoot);
				TreeNew[SchemaRoot[KeyNew.__].__] = TreeNew[KeyNew.__];
				delete TreeNew[KeyNew.__];
			};
		} else {
		// Values
			TreeNew[KeyNew] = Content;
		};
	});
	return TreeNew;
};
