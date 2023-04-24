if (!Array.prototype.from) {
	Array.prototype.from = function from(List) {
		var Arr = [];
		for (var i=0; i<List.length; i++) {
			Arr.push(List[i]);
		};
		return Arr;
	};
};
