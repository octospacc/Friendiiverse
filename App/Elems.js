function MkHtmlEl(Tag, Attrs) {
	var El = document.createElement(Tag);
	if (Attrs) {
		Object.keys(Attrs).forEach(function(Attr){
			El[Attr] = Attrs[Attr];
		});
	};
	return El;
};

function MkWindow(Attrs) {
	var Window = MkHtmlEl('div', Attrs);
	Window.className += ' Window';
	Root.appendChild(Window);
	return Window;
};

function MkSelectMenu(Opts, Attrs) {
	var Menu = MkHtmlEl('div', Attrs);
	var OptsHtml = '';
	Opts.forEach(function(Opt){
		OptsHtml += '<li>' + MkHtmlEl('button', Opt).outerHTML + '</li>';
	});
	Menu.innerHTML = `
		<button onclick="var El = this.nextElementSibling; El.hidden = !El.hidden;">
			Select
		</button>
		<ul hidden="true">
			${OptsHtml}
		</ul>
	`;
	Menu.className += ' SelectMenu';
	return Menu;
};
