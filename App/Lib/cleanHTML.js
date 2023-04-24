/*!
 * Sanitize an HTML string
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * https://vanillajstoolkit.com/helpers/cleanhtml/
 * (Modified from original)
 */
function SanitizeHtml(str, nodes) {
	function stringToHTML() {
		var parser = new DOMParser();
		var doc = parser.parseFromString(str, 'text/html');
		return doc.body || document.createElement('body');
	};
	function removeScripts(html) {
		Array.from(html.querySelectorAll('script')).forEach(function(script){
			script.remove();
		});
	};
	function isPossiblyDangerous(name, value) {
		var val = value.replace(/\s+/g, '').toLowerCase();
		if (['src', 'href', 'xlink:href'].includes(name)) {
			if (val.includes('javascript:') || val.includes('data:')) return true;
		};
		if (name.startsWith('on')) return true;
	};
	function removeAttributes(elem) {
		// Loop through each attribute
		// If it's dangerous, remove it
		Array.from(elem.attributes).forEach(function(att){
			if (isPossiblyDangerous(att.name, att.value))
				elem.removeAttribute(att.name);
		});
	};
	function clean(html) {
		Array.from(html.children).forEach(function(node){
			removeAttributes(node);
			clean(node);
		});
	};
	// Convert the string to HTML
	var html = stringToHTML();
	// Sanitize it
	removeScripts(html);
	clean(html);
	// If the user wants HTML nodes back, return them
	// Otherwise, pass a sanitized string back
	return nodes ? html.childNodes : html.innerHTML;
};
