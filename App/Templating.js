var Templating = {
	ViewNote(Note, Override) {
		Override = Override || {};
		//var Url = TryStr(Note.Url) || Note.ServerId;
		var Url = Override.Url || GetWebUrl(Note, 'Note');
		//var ProfileUrl = TryStr(Note.Profile.Url) || Note.Profile.ServerUsername;
		var ProfileUrl = Override.ProfileUrl || GetWebUrl(Note.Profile, 'Profile');
		//if (Note.Quoting) {
		//	//Note.Quoting.Profile.Url = TryStr(Note.Quoting.Profile.Url) || Note.Quoting.Profile.ServerUsername;
		//};
		return `<div class="View Note">
			<a href="${ProfileUrl}" onclick="DisplayProfile('${ProfileUrl}'); return false;">
				<img class="Profile Icon" src="${MkReqUrl(Note.Profile.Icon)}"/>
				${Note.Profile.Name}
			</a>
			<div class="Note Content">
				${Note.Content ? Note.Content : 'renoted:'}
				${Note.Quoting ? Templating.ViewNote(Note.Quoting) : ''}
			</div>
			<a href="${Url}" onclick="DisplayThread('${Url}'); return false;">
				${Note.Time}
			</a>
		</div>`;
	},
	ViewProfile(Profile, Override) {
		Override = Override || {};
		//var Url = TryStr(Profile.Url) || Profile.ServerUsername;
		var Url = Override.Url || GetWebUrl(Profile, 'Profile');
		var Name = Override.Name || Profile.Name;
		return `<div class="View Profile">
			<a href="${Url}" onclick="DisplayProfile('${Url}'); return false;">
				<img class="Profile Banner" data-assign="src=Banner" src="${Override.Banner || MkReqUrl(Profile.Banner)}"/>
				<div>
					<img class="Profile Icon" data-assign="src=Icon" src="${Override.Icon || MkReqUrl(Profile.Icon)}"/>
					<span data-assign="innerHTML=Name">
						${Name}
					</span>
				</div>
			</a>
		</div>`;
	},
};
