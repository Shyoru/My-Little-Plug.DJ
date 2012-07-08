$(document).ready(function(e) {
	
	if (document.location.pathname == "/")
		return;
	
	/*
	API.addEventListener(API.WAIT_LIST_UPDATE, function(users) {
		console.log("Wait list update");
	});
	API.addEventListener(API.CHAT, function(data) {
		console.log("Chat");
	});
	API.addEventListener(API.VOTE_UPDATE, function(vote) {
		console.log("Vote");
		if (window.webkitNotifications.checkPermission() == 0) {
			var notification = webkitNotifications.createNotification("icon.png","Vote",vote.vote == 1?"Brohoof":"Meh");
			notification.show();
			setTimeout(notification.close(),1500);
		} else
			window.webkitNotifications.requestPermission();
	});
	
	function updatePonify(newState) {
		console.log("Got it!");
	}
	*/
	
	$("#room-score-positive").attr("title","Brohoofs");
});