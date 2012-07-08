var s = document.createElement('script');
s.src = chrome.extension.getURL("js/json.js");
document.head.appendChild(s);

$(document).ready(function() {
	var history = [];
	var favorites = [];
	var historyDiv = document.getElementById("history");
	var favoriteDiv = document.getElementById("favorites");

	function updateEventListeners() {
		$(".line").unbind();
		$(".line").mouseover(showButtons);
		$(".line").mouseout(hideButtons);
		buttons = document.querySelectorAll('button');
		for (i=0;i<buttons.length;i++)
			buttons[i].addEventListener('click', clickHandler);
	}

	function addFavorite(room) {
		if (isFavorite(room))
			return;
		for (i in history) {
			if (room == history[i]["urlTitle"])
				favorites.push(history[i]);
		}
		localStorage.mlpdj_favorites = JSON.stringify(favorites);
		update();
	}

	function removeFavorite(room) {
		for (var i in favorites) {
			if (room == favorites[i]["urlTitle"])
				favorites.splice(i,1);
		}
		localStorage.mlpdj_favorites = JSON.stringify(favorites);
		update();
	}

	function isFavorite(room) {
		for (var i in favorites) {
			if (room == favorites[i]["urlTitle"])
				return true;
		}
		return false;
	}

	function getFavorites() {
		favorites = [];
		if (localStorage.mlpdj_favorites != undefined)
			favorites = JSON.parse(localStorage.mlpdj_favorites);
	}

	function update() {
		updateFavorites();
		updateHistory();
		updateEventListeners();
	}

	function updateHistory() {
		history = localStorage.mlpdj_history;
		var historyHTML = '<strong>' + chrome.i18n.getMessage("titleHistory") + '</strong>';
		if (history != undefined) {
			history = JSON.parse(history);
			for (var i in history)
				historyHTML += '<div class="line"><a href="http://www.plug.dj/' + history[i]["urlTitle"] + '" target="_new">' + history[i]["title"] + '</a> <div class="buttons">' + (isFavorite(history[i]["urlTitle"])?'<button id="remove" name="' + history[i]["urlTitle"] + '" title="Remove from favorites">-</button>':'<button id="add" name="' + history[i]["urlTitle"] + '" title="Add to favorites">+</button></div></div>');
		} else
			historyHTML += '<br /><em>' + chrome.i18n.getMessage("noHistory") + '</em>';
		historyDiv.innerHTML = historyHTML;
	}

	function updateFavorites() {
		getFavorites()
		var favoriteHTML = '<strong>' + chrome.i18n.getMessage("titleFavorites") + '</strong>';
		if (favorites.length > 0) {
			for (i in favorites)
				favoriteHTML += '<div class="line"><a href="http://www.plug.dj/' + favorites[i]["urlTitle"] + '" target="_new">' + favorites[i]["title"] + '</a> <div class="buttons"><button id="remove" name="' + favorites[i]["urlTitle"] + '" title="Remove from favorites">-</button></div></div>';
		} else
			favoriteHTML += '<br /><em>' + chrome.i18n.getMessage("noFavorites") + '</em>';
		favoriteDiv.innerHTML = favoriteHTML;
	}

	function clickHandler(e) {
		if (e.target.id == "add")
			addFavorite(e.target.name);
		else if (e.target.id == "remove")
			removeFavorite(e.target.name);
		else
			throw new Error("Could not get action");
		e.preventDefault();
	}
	
	document.getElementById('title').innerHTML   = chrome.i18n.getMessage("applicationName")
	document.getElementById('version').innerHTML = "Version " + chrome.i18n.getMessage("version")

	update();
});