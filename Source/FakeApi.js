var FakeApi = {
	// 
	Mastodon: {
		//"timelines/public": 
	},
};

FakeApi.Mastodon.Account = {
	"avatar": "https://picsum.photos/64",
	"url": "https://mastodon.example.com/@Tester",
};

FakeApi.Mastodon.Status = {
	"account": FakeApi.Mastodon.Account,
	"content": "<p>Lorem ipsum dolor sit amet...</p>",
	"created_at": "2023-01-01T13:00:00.123Z",
	"url": "https://mastodon.example.com/@Tester/1234567890",
};
