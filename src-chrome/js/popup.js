var s = document.createElement('script');
s.src = chrome.extension.getURL("js/json.js");
document.head.appendChild(s);

var history = [];
var favorites = [];
var historyDiv = document.getElementById("history");
var favoriteDiv = document.getElementById("favorites");

function updateEventListeners() {
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
	var historyHTML = '<strong>' + chrome.i18n.getMessage("history") + '</strong>';
	if (history != undefined) {
		history = JSON.parse(history);
		for (var i in history)
			historyHTML += '<br /><a href="http://www.plug.dj/' + history[i]["urlTitle"] + '" target="_new">' + history[i]["title"] + '</a> ' + (isFavorite(history[i]["urlTitle"])?'<button id="remove" name="' + history[i]["urlTitle"] + '">-</button>':'<button id="add" name="' + history[i]["urlTitle"] + '">+</button>');
	} else
		historyHTML += '<br /><em>' + chrome.i18n.getMessage("noHistory") + '</em>';
	historyDiv.innerHTML = historyHTML;
}

function updateFavorites() {
	getFavorites()
	var favoriteHTML = '<strong>' + chrome.i18n.getMessage("favorites") + '</strong>';
	if (favorites.length > 0) {
		for (i in favorites)
			favoriteHTML += '<br /><a href="http://www.plug.dj/' + favorites[i]["urlTitle"] + '" target="_new">' + favorites[i]["title"] + '</a> <button id="remove" name="' + favorites[i]["urlTitle"] + '">-</button>';
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

update();
document.getElementById('title').innerHTML = chrome.i18n.getMessage("applicationName")
document.getElementById('title').innerHTML = chrome.i18n.getMessage("version")