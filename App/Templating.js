var Templating = {
	ViewNote(Note) {
		return `<div class="View Note">
			<a href="${Note.Profile.Url}" onclick="DisplayProfile('${Note.Profile.Url}'); return false;">
				<img class="Profile Icon" src="${Note.Profile.Icon}"/>
				${Note.Profile.Name}
			</a>
			${Note.Content ? Note.Content : 'renoted:'}
			${Note.Quoting ? Templating.ViewNote(Note.Quoting) : ''}
			<a href="${Note.Url}" onclick="DisplayThread('${Note.Url}'); return false;">${Note.Time}</a>
		</div>`;
	},
};
