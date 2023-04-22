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
	Note: { // TODO: Figure out renotes
		Content: {
			Mastodon: "content",
			Misskey: "text",
		},
		Profile: {
			Mastodon: "account",
			Misskey: "user",
		},
		Time: {
			Mastodon: "created_at",
			Misskey: "createdAt",
		},
		Url: {
			Mastodon: "url",
		},
	},
	Profile: {
		Avatar: {}, // would "Character" be better?
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
		Type: {}, // user, bot, channel, group
		Url: {
			Mastodon: "url",
		},
	},
};

var TransParsers = {
	Mastodon: {
		Account(Data) {
			//return JsonTransformA(Data, TransSchemas.Mastodon.Author, TransSchemas.Mastodon);
			return JsonTransformB(Data, ApiSchema, ApiSchema.Profile, 'Mastodon');
		},
		/*
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
