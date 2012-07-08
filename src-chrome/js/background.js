var tabs = [];

function updateBackground(tabId) {
	try {
		var settings = localStorage.settings == undefined ? {} : JSON.parse(localStorage.settings);
		chrome.tabs.insertCSS(tabId,{code: 'html { background: url(' + (settings["room.background"] == undefined ? chrome.extension.getURL("/images/background.png") : settings["room.background"]) + ') no-repeat scroll center top #424242; }'});
	} catch(err) {}
}

function updatePonify(newState) {
	//FUTURE FEATURE : Enable/Disable ponify chat on the run
	/*tabs.forEach(function(element, index, array) {
		chrome.tabs.executeScript(element,{code: 'updatePonify(' + newState + ');'});
	});*/
}

function updateAllBackgrounds() {
	tabs.forEach(function(element, index, array) {
		updateBackground(element);
	});
}

function getAllTabs() {
	var refreshTabs = confirm("Already open tabs must be refreshed to get all features.\nWill you update them now?");
	chrome.tabs.query({},function(allTabs) {
		allTabs.forEach(function(tab, i, arr) {
			if (tab.url.substring(0,4) == "http" && tab.url.match(/:\/\/(www\.)?(.[^/:]+)/)[2] == "plug.dj") {
				var found = false;
				var tabId = tab.id;
				tabs.forEach(function(element, index, array) {
					if (element == tabId)
						found = true;
				});
				if (!found) {
					if (refreshTabs)
						chrome.tabs.reload(tabId);
					else {
						tabs.push(tabId);
						ponifyTab(tabId);
					}
				}
			}
		});
	});
}

function ponifyTab(tabId) {
	updateBackground(tabId);
}

function checkForValidUrl(tabId, changeInfo, tab) {
	if (tab.url.substring(0,4) == "http" && tab.url.match(/:\/\/(www\.)?(.[^/:]+)/)[2] == "plug.dj") {
		var found = false;
		tabs.forEach(function(element, index, array) {
			if (element == tabId)
				found = true;
		});
		if (!found)
			tabs.push(tabId);
		if (tab.status == "complete") {
			updateBackground(tabId);
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
	} else {
		tabs.forEach(function(element, index, array) {
			if (element == tabId)
				tabs.splice(index,1);
		});
	}
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	tabs.forEach(function(element, index, array) {
		if (element == tabId)
			tabs.splice(index,1);
	});
});

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		if (details.url.indexOf("lang_") > -1) {
			var filename = details.url.substring(details.url.lastIndexOf('/')+1);
			return {redirectUrl: chrome.extension.getURL("js/lang/" + filename)};
		} else {
			return {cancel: false}
			//return {redirectUrl: chrome.extension.getURL("js/room.js")};
		}
	},
	{urls: ["http://plug.dj/js/lang_*","http://www.plug.dj/js/lang_*","http://www.plug.dj/js/room.min.js*"]},
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
	} else if (request.method == "getSettings" && request.keys instanceof Array) {
		var response = {};
		var settings = localStorage.settings == undefined ? {} : JSON.parse(localStorage.settings);
		request.keys.forEach(function(element, index, array) {
			response[element] = settings[element];
		});
		sendResponse(response);
	} else if (request.method == "i18n" && request.keys instanceof Array) {
		var response = {};
		request.keys.forEach(function(element, index, array) {
			response[element] = chrome.i18n.getMessage(element);
		});
		sendResponse(response);
	} else
		sendResponse({status: "Error"});
});

getAllTabs();