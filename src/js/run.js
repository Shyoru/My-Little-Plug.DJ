var s = document.createElement('script');
s.src = chrome.extension.getURL("js/runAPI.js");
document.head.appendChild(s);

var words = {
	"points" : "BITS",
	"USERS" : "PONIES",
	"WOOT!" : "BROHOOF!",
	"Now Playing" : "DJ-Pon3's playing:",
	"Time Remaining" : "Clock is ticking...",
	"Crowd Response" : "Herd response",
	"Volume" : "Too loud?",
	"Current DJ" : "The pony everypony should listen to"
};

String.prototype.prepareRegex = function() {
	return this.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, "\\$1");
};

function isOkTag(tag) {
	return (",pre,blockquote,code,input,button,textarea".indexOf(","+tag) == -1);
}

var regexs = new Array(), replacements = new Array();
for (var word in words) {
	if (word != "") {
		regexs.push(new RegExp("\\b" + word.prepareRegex().replace(/\*/g,'[^ ]*') + "\\b", 'gi'));
		replacements.push(words[word]);
	}
}

var texts = document.evaluate(".//text()[normalize-space(.)!='']",document.body,null,6,null), text="";
for (var i=0,l=texts.snapshotLength;(this_text=texts.snapshotItem(i));i++) {
	if (isOkTag(this_text.parentNode.tagName.toLowerCase()) && (text=this_text.textContent)) {
		for (var x=0,l=regexs.length;x<l;x++) {
			text = text.replace(regexs[x], replacements[x]);
			this_text.textContent = text;
		}
	}
}