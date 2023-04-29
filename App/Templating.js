var Templating = {
	ViewNote(Note) {
		return `<div class="View Note">
			<a href="${Note.Profile.Url}" onclick="DisplayProfile('${Note.Profile.Url}'); return false;">
				<img class="Profile Icon" src="${MkUrl(Note.Profile.Icon)}"/>
				${Note.Profile.Name}
			</a>
			<div class="Note Content">
				${Note.Content ? Note.Content : 'renoted:'}
				${Note.Quoting ? Templating.ViewNote(Note.Quoting) : ''}
			</div>
			<a href="${Note.Url}" onclick="DisplayThread('${Note.Url}'); return false;">${Note.Time}</a>
		</div>`;
	},
	ViewProfile(Profile) {
		return `<div class="View Profile" style="display: inline-block;">
			<a href="${Profile.Url}">
				<img class="Profile Banner" src="${MkUrl(Profile.Banner)}"/>
				<div>
					<img class="Profile Icon" src="${MkUrl(Profile.Icon)}"/>
					${Profile.Name}
				</div>
			</a>
		</div>`;
	},
};
