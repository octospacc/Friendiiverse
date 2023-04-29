function NetCall(Data, Proc) {
	var Method = Data.Method.split(' ')[0];
	var Endpoint = Data.Method.split(' ').slice(1).join(' ');
	var Req = new XMLHttpRequest();
	Req.Proc = Proc;
	Req.onloadend = function(){
		try {
			this.responseJson = JSON.parse(this.responseText);
			this.responseLog = this.responseJson;
		} catch(Ex) {
			this.responseLog = this.responseText;
			LogDebug(Ex, 'e');
		};
		if (Data.Call) {
			Data.Call(this);
		};
		if (IsHttpCodeGood(this.status)) {
			LogDebug([this.status, this.responseLog], 'l');
			if (Data.CallFine) {
				Data.CallFine(this);
			};
		} else {
			LogDebug([this.status, this.responseLog], 'e');
			if (Data.CallFail) {
				Data.CallFail(this);
			};
		};
	};
	//if (Data.Target == 'Friendica') {
	//	Req.open(Method, `${FriendicaUrl}/api/${Endpoint}.json`, true);
	//	Req.setRequestHeader('Authorization', `Basic ${btoa(FriendicaCredentials)}`);
	//};
	Req.open(Method, MkUrl(`${Data.Target}/${Endpoint}`), true);
	Req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	_.forOwn(_.merge({"Content-Type": "application/json"}, Data.Headers), function(Val, Key) {
		Req.setRequestHeader(Key, Val);
	});
	if (Method === 'POST' && !Data.Data) {
		Data.Data = {};
	};
	Req.withCredentials = false;
	Req.send(JSON.stringify(Data.Data));
};

function IsHttpCodeGood(Code) {
	Code = String(Code)[0];
	if (['1', '2', '3'].includes(Code)) {
		return true;
	} else
	if (['4', '5'].includes(Code)) {
		return false;
	};
};

function MkUrl(Url) {
	if (Url && !Url.toLowerCase().startsWith(HttpProxy)) {
		Url = HttpProxy + Url;
	};
	return Url;
};

function UrlBase(Url) {
	var Lower = Url.toLowerCase();
	var Domain = UrlDomain(Url);
	if (Lower.startsWith('https://')) {
		return `https://${Domain}`;
	} else {
		return `http://${Domain}`;
	};
};

function UrlDomain(Url) {
	if (_.some(['//', 'http://', 'https://'], function(Sub){ return Url.toLowerCase().startsWith(Sub); })) {
		return Url.split('//')[1].split('/')[0];
	} else {
		return Url.split('/')[0];
	};
	
};
