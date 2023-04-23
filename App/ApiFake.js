var FakeApi = {
	Friendiiverse: {
		Featured: {
			Featured: [],
			Categories: [],
		},
	},
	Mastodon: {
		//"timelines/public": 
	},
};

FakeApi.Friendiiverse.Featured.Featured.push({
	Banner: "https://picsum.photos/seed/Testing.Banner/320/180",
	Icon: "https://picsum.photos/seed/Testing.Icon/64",
	Name: "Testing Channel",
	Url: "https://lemmy.example.com/c/Testing",
});
FakeApi.Friendiiverse.Featured.Categories.push({
	Banner: "https://picsum.photos/seed/fediverse.Banner/320/180",
	Icon: "https://picsum.photos/seed/fediverse.Icon/64",
	Name: "#fediverse",
	Url: "https://mastodon.example.com/hashtag/fediverse",
});

FakeApi.Mastodon.Account = {
	avatar: "https://picsum.photos/seed/Tester.Icon/64",
	display_name: "The Tester",
	header: "https://picsum.photos/seed/Tester.Banner/320/180",
	url: "https://mastodon.example.com/@Tester",
};
FakeApi.Friendiiverse.Featured.Featured.push(
	ApiTransform(FakeApi.Mastodon.Account, 'Mastodon', 'Profile'));

FakeApi.Mastodon.Status = {
	account: FakeApi.Mastodon.Account,
	content: "<p>Lorem ipsum dolor sit amet...</p>",
	created_at: "2023-01-01T13:00:00.123Z",
	url: "https://mastodon.example.com/@Tester/1234567890",
};
