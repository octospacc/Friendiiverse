function ApiCall(Data, Proc) {
	// Data = {Target: "Friendica", Method: "...", Data: {}, Call: (), CallFine: (), CallFail: ()}
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
	if (Data.Target == 'Mastodon') {
		Req.open('GET', `${MastodonUrl}/api/v1/${Data.Method}`, true);
	} else
	if (Data.Target == 'Friendica') {
		Req.open('GET', `${FriendicaUrl}/api/${Data.Method}.json`, true);
		Req.setRequestHeader('Authorization', `Basic ${btoa(FriendicaCredentials)}`);
	};
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
