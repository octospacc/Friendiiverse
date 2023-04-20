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

var ApiSchema = {
	__Account__: {
		Banner: {
			Mastodon: "header",
		},
		Icon: {
			Mastodon: "avatar",
		},
		Name: {
			Mastodon: "display_name",
		},
		Url: {
			Mastodon: "url",
		},
	},
	Note: {
		Author: {
			Mastodon: "account",
		},
		Content: {
			Mastodon: "content",
		},
		Time: {
			Mastodon: "created_at",
		},
		Url: {
			Mastodon: "url",
		},
	},
};
ApiSchema.Author = CopyObj(ApiSchema.__Account__);
ApiSchema.Channel = CopyObj(ApiSchema.__Account__);

var TransParsers = {
	Mastodon: {
		Account(Data) {
			return JsonTransformA(Data, TransSchemas.Mastodon.Author, TransSchemas.Mastodon);
		},
		Instance(Data) {
			return JsonTransformA(Data, TransSchemas.Mastodon.Instance, TransSchemas.Mastodon);
		},
		Status(Data) {
			//return JsonTransformA(Data, TransSchemas.Mastodon.Status, TransSchemas.Mastodon);
			return JsonTransformB(Data, ApiSchema, ApiSchema.Note, 'Mastodon');
		},
	},
};
