var TransSchemas = {
	Mastodon: {
		Account: {
			"__": "Author",
			"url": "Url",
			"avatar": "Picture",
			"header": "Banner",
		},
		Instance: {
			"thumbnail": "Banner",
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
var TransSchemas_ = {
	"Note": {
		"Author": {
			"Mastodon": "Status.account"
		},
		"Content": {
			"Mastodon": "Status.content"
		},
		"Url": {
			"Mastodon": "Status.url"
		},
	},
};

var TransParsers = {
	Mastodon: {
		Account(Data) {
			return JsonTransformA(Data, TransSchemas.Mastodon.Author, TransSchemas.Mastodon);
		},
		Instance(Data) {
			return JsonTransformA(Data, TransSchemas.Mastodon.Instance, TransSchemas.Mastodon);
		},
		Status(Data) {
			return JsonTransformA(Data, TransSchemas.Mastodon.Status, TransSchemas.Mastodon);
			// return JsonTransformB({Status: Data}, TransSchemas_, TransSchemas_.Note, 'Mastodon');
		},
	},
};
