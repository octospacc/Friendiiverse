function MakeWindow(Attrs) {
	var Window = document.createElement('div');
	if (Attrs) {
		Object.keys(Attrs).forEach(function(Attr){
			Window[Attr] = Attrs[Attr];
		});
	};
	Window.className += ' Window';
	Root.appendChild(Window);
	return Window;
};
