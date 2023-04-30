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
	__All__: {
		//ServerId: {
		//	__All__: "id",
		//},
		// NOTE: objects that embed cross-server data (e.g. a renote), might get this value assigned wrong for our needs (???)
		ServerSoftware: {
			__All__: {__EvalSet__: "TypeOld"},
		},
	},
	Note: {
		Content: {
			Mastodon: "content",
			Misskey: "text",
		},
		Profile: {
			__: "Profile",
			Mastodon: "account",
			Misskey: "user",
		},
		Quoting: {
			__: "Note",
			Mastodon: "reblog",
			Misskey: "renote",
		},
		Time: {
			Mastodon: "created_at",
			Misskey: "createdAt",
		},
		Url: {
			__All__: {__OldOr__: ["url", "uri"]},
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
		//ServerUsername: {
		//	__All__: "username",
		//},
		Type: { // user, bot, group, channel:[normal, server]
			Mastodon: {__EvalSet__: `
				if (TreeOld.bot) 'Bot';
				else
				if (TreeOld.group) 'Group';
			`},
			Misskey: {__EvalSet__: `
				if (TreeOld.isBot) 'Bot';
			`},
		},
		Url: {
			__All__: {__OldOr__: ["url", "uri"]},
			Mastodon: "url",
		},
	},
};

var ApiEndpoints = {
	FetchNotes: {
		Mastodon(Profile) {
			// Must actually get the id by calling GET api/v1/accounts/lookup?acct=USERNAME, the provided one is glitchy
			return `GET api/v1/accounts/${Profile.__TreeOld__.id}/statuses`;
		},
		Misskey(Profile) {
			return {
				Method: "POST api/users/notes",
				Data: {"userId": Profile.Id},
			};
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
		Misskey: "POST api/notes/local-timeline",
	},
};

var WebEndpoints = {
	Note: {
		Misskey(Note) {
			//return `SERVER_URL/notes/${Note.ServerId}`;
			return `SERVER_URL/notes/${Note.__TreeOld__.id}`;
		},
	},
	Profile: {
		Misskey(Profile) {
			var Host = Profile.__TreeOld__.host;
			//return `SERVER_URL/@${Profile.ServerUsername}`;
			return `SERVER_URL/@${Profile.__TreeOld__.username}`;
		},
	},
};

function ApiTransform(Data, FromSource, DestType) {
	var DataFinal = JsonTransformB(Data, ApiSchema, ApiSchema[DestType], FromSource);
	LogDebug([Data, DestType, FromSource, DataFinal]);
	return DataFinal;
};

function GetWebUrl(Data, Type) {
	return (TryStr(Data.Url)
		? Data.Url
		: WebEndpoints[Type][Data.ServerSoftware](Data)
	);
	//return Data.Url || WebEndpoints[Type][Data.ServerSoftware](Data);
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
