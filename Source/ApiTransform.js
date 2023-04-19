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
			return JsonTransform(Data, TransSchemas.Mastodon.Author, TransSchemas.Mastodon);
		},
		Status(Data) {
			return JsonTransform(Data, TransSchemas.Mastodon.Status, TransSchemas.Mastodon);
		},
	},
};
