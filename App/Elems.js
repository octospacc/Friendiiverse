function HtmlEl(Tag, Attrs) {
	var El = document.createElement(Tag);
	if (Attrs) {
		Object.keys(Attrs).forEach(function(Attr){
			El[Attr] = Attrs[Attr];
		});
	};
	return El;
};

function MakeWindow(Attrs) {
	var Window = HtmlEl('div', Attrs);
	Window.className += ' Window';
	Root.appendChild(Window);
	return Window;
};

function Dropdown(Attrs) {
	var Menu = HtmlEl('div', Attrs);
	Window.className += ' Dropdown';
	return Menu;
};
