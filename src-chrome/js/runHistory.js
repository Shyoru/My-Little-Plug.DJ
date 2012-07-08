function runAfter() {
	var url = document.location.href;
	if (url.substring(0,10) == "http://www")
		url = url.substring(19,url.lastIndexOf('/'));
	else
		url = url.substring(15,url.lastIndexOf('/'));

	var title = document.getElementById('current-room-value').innerHTML;
	var now = new Date();
	var found = false;
	for (i in history) {
		if (url == history[i]["urlTitle"]) {
			var oldEntry = history[i];
			oldEntry.title = title;
			oldEntry.time = now.getTime();
			found = true;
			history.splice(i,1);
			history.splice(0,0,oldEntry);
			break;
		}
	}
	if (!found) {
		var newEntry = {};
		newEntry.urlTitle = url;
		newEntry.title = title;
		newEntry.time. = now.getTime();
		history.splice(0,0,newEntry);
	}
	chrome.extension.sendRequest({method: "getSettings",keys: ["history.amount"]}, function(response) {
		var limit = response.history.amount == undefined ? 10 : response.history.amount;
		if (history.length > limit)
			history.splice(limit,history.length-limit);
		chrome.extension.sendRequest({method: "setHistory",value: JSON.stringify(history)}, function(response) {
			if (response.status == "success")
				console.log("[" + chrome.i18n.getMessage("applicationName") + "] Updated history");
			else
				console.log("[" + chrome.i18n.getMessage("applicationName") + "] Couldn't update history");
		});
	});
}

var history = [];
chrome.extension.sendRequest({method: "getHistory"}, function(response) {
	if (response.status == "success")
		history = JSON.parse(response.history);
	runAfter();
});