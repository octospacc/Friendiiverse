/*
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
*/

var ApiSchema = {
	__Account__: {
		Banner: {
			Mastodon: "header",
			Misskey: "bannerUrl",
		},
		Description: {
			Mastodon: "note",
			Misskey: "description",
		},
		Icon: {
			Mastodon: "avatar",
			Misskey: "avatarUrl",
		},
		Name: {
			Mastodon: "display_name",
			Misskey: "name",
		},
		Url: {
			Mastodon: "url",
		},
	},
	Note: {
		Author: {
			Mastodon: "account",
			Misskey: "user",
		},
		Content: {
			Mastodon: "content",
			Misskey: "text",
		},
		Time: {
			Mastodon: "created_at",
			Misskey: "createdAt",
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
		/*
		Account(Data) {
			return JsonTransformA(Data, TransSchemas.Mastodon.Author, TransSchemas.Mastodon);
		},
		Instance(Data) {
			return JsonTransformA(Data, TransSchemas.Mastodon.Instance, TransSchemas.Mastodon);
		},
		*/
		Status(Data) {
			//return JsonTransformA(Data, TransSchemas.Mastodon.Status, TransSchemas.Mastodon);
			return JsonTransformB(Data, ApiSchema, ApiSchema.Note, 'Mastodon');
		},
	},
	Misskey: {
	},
};
