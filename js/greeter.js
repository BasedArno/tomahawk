var DEBUG = true;
var selectedUser = null;

/**
 * UI Initialization.
 */
$(document).ready(function() {
	// user list building
	var user_input = document.getElementById('user_id');
	for (idx in lightdm.users)
	{
		user = lightdm.users[idx];
		var image_src = user.image.length > 0 ? user.image : 'img/boot-repair.svg';
		add_option(user_input, user.display_name, user.name);
	}
	
	// session list building
	for(idx in lightdm.sessions)
	{
		session = lightdm.session[idx];
		add_option(session_input, session.display_name, session.name);
	}
	
	$('#timer_image').hide();
	$('#log_area').hide();
	
	// password key trigger registering
	$("#password_area").keypress(function() {
		log("keypress(" + event.which + ")")
		if (event.which == 13) { // 'Enter' key
			submitPassword();
		}

	});
	$(document).keyup(function(e) {
		if (e.keyCode == 27) { // 'Escape' char
			cancel_authentication();
		}
	});

	// Logs ?
	if (DEBUG) {
		$("#log_area").show();
	}
});

/**
 * 
 */
function add_option(form, text, value) {
	var select = document.getElementById(form);
	var option = document.createElement("option");
	option.text = text;
	option.value = value;
	select.add(option);
}

function start_authentication(userId) {
	log("start_authentication(" + userId + ")");
	cancel_authentication();
	selectedUser = userId;
	lightdm.start_authentication(selectedUser);
}

function cancel_authentication() {
	log("cancel_authentication()");
	$('#timer_image').hide();
	if (selectedUser != null) {
		lightdm.cancel_authentication();
		log("authentication cancelled for " + selectedUser);
		selectedUser = null;
	}
	return true;
}

function submit_password()
{
	log("provide_secret()");
	lightdm.provide_secret($('#password_input').val());
	$('#timer_image').show();
	log("done");
}

/**
 * Image loading management.
 */

function imgNotFound(source){
	source.src = 'img/boot-repair.svg';
	source.onerror = "";
	return true;
}


/**
 * Lightdm Callbacks
 */
function show_prompt(text) {
	log("show_prompt(" + text + ")");
	$('#passwordField').val("");
	$('#passwordArea').show();
	$('#passwordField').focus();
}

function authentication_complete() {
	log("authentication_complete()");
	$('#timer_image').hide();
	if (lightdm.is_authenticated) {
		log("authenticated !");
		session = $('#session_input').val();
		lightdm.login (lightdm.authentication_user, session);
	}
	else {
		log("not authenticated !");
	}
}

/**
 * Logs.
 */
function log(text) {
	if (DEBUG) {
		$('#log_area').append(text);
		$('#log_area').append('<br/>');
	}
}
