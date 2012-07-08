var settings = localStorage.settings == undefined ? {} : JSON.parse(localStorage.settings);

function load() {
	var history_amount = loadWithDefault('history.amount',10);
	$('#history_amount').val(history_amount);
	$('#historyAmount').text(history_amount);
	$('#room_background').val(loadWithDefault('room.background','chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/background.png'));
	if (loadWithDefault('room.ponychat',false))
		$('#room_ponychat').attr('checked','checked');
}

function loadWithDefault(key,defaultValue) {
	if (settings[key] == undefined || settings[key] == "")
		return defaultValue;
	return settings[key];
}

function save() {
	settings["history.amount"] = isNaN($('#history_amount').val())?10:$('#history_amount').val();
	settings["room.background"] = $('#room_background').val();
	settings["room.ponychat"] = $("#room_ponychat").attr('checked') == 'checked' ? true : false;
	localStorage.settings = JSON.stringify(settings);
	chrome.extension.getBackgroundPage().updateAllBackgrounds();
}

$(document).ready(function() {
	$('#project_title').html(chrome.i18n.getMessage("applicationName") + ' <span style="font-size:0.5em">' + chrome.i18n.getMessage("version") + '</span>');
	$('#titleAvatars').html(chrome.i18n.getMessage("titleAvatars") + chrome.i18n.getMessage("featureNotDone"));
	jQuery.each($('.locale'), function() {
		$(this).html(chrome.i18n.getMessage(this.id));
	});
	
	$('.soooooooon').find('input').attr('disabled','disabled');

	document.getElementById('history_amount').addEventListener('change',function(data) {
		document.getElementById('historyAmount').innerText = data.target.value;
	});
	
	load();
	
	$('#room_ponychat').iphoneStyle({checkedLabel: 'ENABLED',uncheckedLabel: 'DISABLED',onChange: function(elem, value) {save();chrome.extension.getBackgroundPage().updatePonify(value)}});
	$('#avatars_enabled').iphoneStyle({checkedLabel: 'ENABLED',uncheckedLabel: 'DISABLED',onChange: function(elem, value) {save();chrome.extension.getBackgroundPage().updatePonify(value)}});
	$('input').change(function() { save(); });
});