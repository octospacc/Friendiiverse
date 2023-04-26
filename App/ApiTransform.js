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
	//__All__: {
	//	__Software__: {
	//		__EvalSet__: "TypeOld",
	//	},
	//},
	Note: {
		Content: {
			Mastodon: "content",
			Misskey: "text",
		},
		Profile: {
			Mastodon: "account",
			Misskey: "user",
		},
		Quoting: {
			Mastodon: "reblog",
			Misskey: "renote",
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
			Mastodon: {__OldOr__: ["header", "thumbnail"]},
			Misskey: "bannerUrl",
		},
		Description: {
			Mastodon: {__OldOr__: ["note", "description"]},
			Misskey: "description",
		},
		Icon: {
			Mastodon: "avatar",
			Misskey: {__OldOr__: ["avatarUrl", "iconUrl"]},
		},
		Name: {
			Mastodon: {__OldOr__: ["display_name", "title"]},
			Misskey: "name",
		},
		Type: { // user, bot, group, channel:[normal, server]
			Mastodon: {__EvalSet__: `
				if (TreeOld.bot) 'Bot';
				else
				if (TreeOld.group) 'Group';
			`},
		},
		Url: {
			Mastodon: "url",
		},
	},
};

var ApiEndpoints = {
	FetchNotes: {
		Mastodon(Profile) {
			return `GET api/v1/accounts/${Profile.Id}/statuses`;
		},
	},
	ServerInfo: {
		Mastodon: "GET api/v1/instance",
		Misskey: {
			Method: "POST api/meta",
			Data: {"detail": true},
		},
	},
	ServerTimeline: {
		Mastodon: "GET api/v1/timelines/public",
	},
};

function ApiTransform(Data, FromSource, DestType) {
	var DataFinal = JsonTransformB(Data, ApiSchema, ApiSchema[DestType], FromSource);
	LogDebug([Data, DestType, FromSource, DataFinal]);
	return DataFinal;
};

/*
var TransParsers = {
	Mastodon: {
		Account(Data) {
			//return JsonTransformA(Data, TransSchemas.Mastodon.Author, TransSchemas.Mastodon);
			return JsonTransformB(Data, ApiSchema, ApiSchema.Profile, 'Mastodon');
		},
		Instance(Data) {
			return JsonTransformA(Data, TransSchemas.Mastodon.Instance, TransSchemas.Mastodon);
		},
		Status(Data) {
			//return JsonTransformA(Data, TransSchemas.Mastodon.Status, TransSchemas.Mastodon);
			return JsonTransformB(Data, ApiSchema, ApiSchema.Note, 'Mastodon');
		},
	},
	Misskey: {
	},
};
*/
