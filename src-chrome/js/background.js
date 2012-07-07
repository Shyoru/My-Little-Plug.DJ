function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.substring(0,4) == "http" && tab.url.match(/:\/\/(www\.)?(.[^/:]+)/)[2] == "plug.dj") {
		chrome.pageAction.show(tabId);
		if (tab.status == "complete") {
			console.log("Complete");
			if (tab.url.substring(0,10) == "http://www")
				lobby = tab.url.length == 19;
			else
				lobby = tab.url.length == 15;
			if (!lobby) {
				setTimeout(function() {
					chrome.tabs.executeScript(tabId,{file: "js/runHistory.js"});
				},3000);
			}
		}
	}
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		if (details.url.indexOf("lang_en") > -1) {
			var filename = details.url.substring(details.url.lastIndexOf('/')+1);
			return {redirectUrl: chrome.extension.getURL("js/lang/" + filename)};
		} else {
			return {cancel: false}
			//return {redirectUrl: chrome.extension.getURL("js/room.js")};
		}
	},
	{urls: ["http://plug.dj/js/lang_en*","http://www.plug.dj/js/lang_en*","http://www.plug.dj/js/room.min.js*"]},
	["blocking"]
);

/*
chrome.webRequest.onResponseStarted.addListener(
	function(details) {
		if (details.url.indexOf("avatar") != -1) {
			console.log(details);
		}
	},
	{urls: ["http://www.plug.dj/js/lang*"]}
);
*/

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getHistory") {
		if (localStorage.mlpdj_history != undefined)
			sendResponse({status: "success", history: localStorage.mlpdj_history});
		else
			sendResponse({status: "noHistory"});
    } else if (request.method == "setHistory" && request.value != "") {
		localStorage.mlpdj_history = request.value;
		sendResponse({status: "success"});
	} else if (request.method == "APIvote" && request.vote != "") {
		var notification = webkitNotifications.createNotification("icon.png","Vote",request.vote.vote == 1?"Brohoof":"Meh");
		notification.show();
	} else
		sendResponse({status: "Error"});
});