var TransSchemas = {
	Mastodon: {
		Account: {
			"__": "Author",
			"url": "Url",
		},
		Status: {
			"__": "Note",
			//"account": {"__": "Account"},
			"content": "Content",
			"created_at": "Time",
			"url": "Url",
		},
	},
};

var TransParsers = {
	Mastodon: {
		Account(Data) {
			return JsonTranslate(Data, TransSchemas.Mastodon.Author);
		},
		Status(Data) {
			return JsonTranslate(Data, TransSchemas.Mastodon.Status);
		},
	},
};

function JsonTranslate(TreeOld, Schema) {
	var TreeNew = {};
	Object.keys(TreeOld).forEach(function(KeyOld){
		var Content = TreeOld[KeyOld];
		var KeyNew = ((typeof(Schema) == 'object' && KeyOld in Schema) ? Schema[KeyOld] : KeyOld);
		if (typeof(Content) == 'object' && Content !== null) {
			if (Array.isArray(Content)) {
			// Lists
				//New[NewKey] = Content;
				//Content.forEach(function());
			} else {
			// Dicts
				if (!KeyNew.__) {
					KeyNew.__ = KeyOld;
				};
				TreeNew[KeyNew.__] = JsonTranslate(Content, KeyNew);
			};
		} else {
		// Values
			TreeNew[KeyNew] = Content;
		};
	});
	return TreeNew;
};
