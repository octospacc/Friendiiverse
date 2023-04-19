function ForceList(Item) {
	return (Array.isArray(Item) ? Item : [Item]);
};

function RndId() {
	return `${Date.now()}${Math.random()}`;
};
