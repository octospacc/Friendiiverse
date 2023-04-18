var TransSchemas = {
	Mastodon: {
		Account: {
			"__": "Author",
			"url": "Url",
		},
		Status: {
			"__": "Note",
			"account": {"__": "Account"},
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

function JsonTranslate(Old, Schema) {
	var New = {};
	Object.keys(Old).forEach(function(OldKey){
		var Content = Old[OldKey];
		var NewKey = (OldKey in Schema ? Schema[OldKey]: OldKey);
		if (typeof(Content) == 'object' && Content !== null) {
			if (Array.isArray(Content)) {
			// Lists
				//New[NewKey] = Content;
				//Content.forEach(function());
			} else {
			// Dicts
				NewKey.__ ||= OldKey;
				New[NewKey.__] = JsonTranslate(Content, NewKey);
			};
		} else {
		// Values
			New[NewKey] = Content;
		};
	});
	return New;
};

