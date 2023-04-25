function NetApiCall(Data, Proc) {
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
	//if (Data.Target == 'Mastodon') {
	//	Req.open(Method, `${MastodonUrl}/api/v1/${Endpoint}`, true);
	//} else
	//if (Data.Target == 'Friendica') {
	//	Req.open(Method, `${FriendicaUrl}/api/${Endpoint}.json`, true);
	//	Req.setRequestHeader('Authorization', `Basic ${btoa(FriendicaCredentials)}`);
	//};
	Req.open(Method, `${Data.Target}/api/v1/${Endpoint}`, true);
	Req.send();
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
