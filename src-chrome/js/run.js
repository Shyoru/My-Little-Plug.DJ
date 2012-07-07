var s = document.createElement('script');
s.src = chrome.extension.getURL("js/runAPI.js");
document.head.appendChild(s);

chrome.extension.sendRequest({method: "i18n", keys: ["wordsPoints","wordsUsers","wordsWoot","wordsNowPlaying","wordsTimeRemaining","wordsCrowdResponse","wordsVolume","wordsCurrentDJ"]}, function(response) {
	var words = {
		"points"         : response.wordsPoints,
		"USERS"          : response.wordsUsers,
		"WOOT!"          : response.wordsWoot,
		"Now Playing"    : response.wordsNowPlaying,
		"Time Remaining" : response.wordsTimeRemaining,
		"Crowd Response" : response.wordsCrowdResponse,
		"Volume"         : response.wordsVolume,
		"Current DJ"     : response.wordsCurrentDJ
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
});

chrome.extension.sendRequest({method: "i18n", keys: ["running","applicationName","longVersion"]}, function(response) {
	$('#chat-messages').append('<div class="chat-update"><span class="chat-text">' + response.running.replace("$1",response.applicationName).replace("$2",response.longVersion) + '</span></div>');
});