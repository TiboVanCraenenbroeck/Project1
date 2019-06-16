let domBTNChangePersonalData,
	domUsername,
	domSurname,
	domName,
	domMail,
	domErrorUserdata,
	domBTNChangePassword,
	domErrorChangePassword,
	domCurrentPassword,
	domNewPassword,
	domConfirmNewPassword,
	domListLang,
	domBTNLang,
	domErrorLang,
	domBTNChangeLang,
	userLang,
	domSignOut,
	domNewUserMail,
	domBTNAddUserMail,
	domErrorAddUser,
	domShutDown;
const getLoginData = function() {
	let un = getCookie('UN');
	let uic = getCookie('UIC');
	return [un, uic];
};
const shutdown = function(data) {
	alert('Bord is afgesloten');
};
const registrationNewUserComplete = function(data) {
	domErrorAddUser.innerHTML = data['NewUser'];
};
const registrationNewUser = function() {
	//Get the mailadres from the inputfield
	let mail = domNewUserMail.value;
	// Send it to the server
	cookieDate = getLoginData();
	inputData = JSON.stringify({
		Type: 2,
		Username: cookieDate[0],
		UIC: cookieDate[1],
		Mail: mail
	});
	handleData(
		`${ipAdress}/api/v1/user/new`,
		registrationNewUserComplete,
		'POST',
		inputData
	);
};
const changePasswordConfirm = function(data) {
	domErrorChangePassword.innerHTML = data['changeData'];
};
const changePassword = function() {
	//Set all the passwords in a var
	let currentPassword = document.querySelector('.js-current-password').value;
	let newPassword = document.querySelector('.js-new-password').value;
	let confirmNewPassword = document.querySelector('.js-confirm-new-password')
		.value;
	//Check if all the fields are fill in
	if (
		currentPassword.length > 0 &&
		newPassword.length > 0 &&
		confirmNewPassword.length > 0
	) {
		// Set all the info in a json object
		cookieDate = getLoginData();
		inputData = JSON.stringify({
			Type: 2,
			Username: cookieDate[0],
			UIC: cookieDate[1],
			CurrentPassword: currentPassword,
			NewPassword: newPassword,
			ConfirmNewPassword: confirmNewPassword
		});
		handleData(
			`${ipAdress}/api/v1/user/settings`,
			changePasswordConfirm,
			'POST',
			inputData
		);
	} else {
		domErrorChangePassword.innerHTML = 'Gelieve alle gegevens in te vullen';
	}
};
const changeUserdata = function(data) {
	domErrorUserdata.innerHTML = data['changeData'];
};
const getPersonalData = function() {
	// Send the updated info to the db
	let username = domUsername.value;
	let surname = domSurname.value;
	let name = domName.value;
	let mail = domMail.value;
	//Check if all the fields are fill in
	if (
		username.length > 0 &&
		surname.length > 0 &&
		name.length > 0 &&
		mail.length > 0
	) {
		cookieDate = getLoginData();
		inputData = JSON.stringify({
			Type: 1,
			Username: cookieDate[0],
			UIC: cookieDate[1],
			UsernameNew: username,
			Name: name,
			Surname: surname,
			Mail: mail
		});
		handleData(
			`${ipAdress}/api/v1/user/settings`,
			changeUserdata,
			'POST',
			inputData
		);
	} else {
		domErrorUserdata.innerHTML = 'Gelieve alle gegevens in te vullen';
	}
};
// Get all the lang from the server to put in the select field
const getLang = function(data) {
	let output = ``;
	for (const lang of data) {
		//Check if the lang the lang of the user is
		if (lang.Language == userLang) {
			output += `<option value="${lang.Language}" selected>${
				lang.Full
			}</option>`;
		} else {
			output += `<option value="${lang.Language}">${lang.Full}</option>`;
		}
	}
	domListLang = document.querySelector('.js-select_lang');
	domListLang.innerHTML = output;
	checkBTNPressed();
};
const changeLang = function(data) {
	domErrorLang.innerHTML = data['changeData'];
};
const getUserdata = function(data) {
	if (data['changeData'][0] == 1) {
		// Queryselector for the changing the userdata
		domUsername = document.querySelector('.js-username');
		domSurname = document.querySelector('.js-surname');
		domName = document.querySelector('.js-name');
		domMail = document.querySelector('.js-mail');
		domErrorUserdata = document.querySelector('.js-error--userdata');
		//Queryselector for cahnging the language
		domErrorLang = document.querySelector('.js-error--lang');
		domBTNChangeLang = document.querySelector('.js-btn--change-lang');
		// Queryselector for changin the password
		domBTNChangePassword = document.querySelector(
			'.js-btn--change-password'
		);
		domErrorChangePassword = document.querySelector(
			'.js-error--changePassword'
		);
		domSignOut = document.querySelector('.js-btn--sign-out');
		// Queryselector for registration of a new user
		domNewUserMail = document.querySelector('.js-mailadres-new-user');
		domBTNAddUserMail = document.querySelector('.js-btn--add-new-user');
		domErrorAddUser = document.querySelector('.js-error--add-user');
		//Get the userdata
		domUsername.value = data['changeData'][1][0]['Username'];
		domSurname.value = data['changeData'][1][0]['Surname'];
		domName.value = data['changeData'][1][0]['Name'];
		domMail.value = data['changeData'][1][0]['Mail'];
		// Get the user lang
		userLang = data['changeData'][1][0]['lang'];
		domBTNChangePersonalData = document.querySelector(
			'.js-btn--change-personaldata'
		);
		handleData(`${ipAdress}/api/v1/lang/getLang`, getLang);
	} else {
		domErrorUserdata.innerHTML = data['changeData'][1];
	}
	//BTN for shut down the plate
	domShutDown = document.querySelector('.js-btn--shut-down');
};
const checkBTNPressed = function() {
	// Button for personal data
	domBTNChangePersonalData.addEventListener('click', function() {
		getPersonalData();
	});
	// Button for password
	domBTNChangePassword.addEventListener('click', function() {
		changePassword();
	});
	// Button for lang
	domBTNChangeLang.addEventListener('click', function() {
		let langValue = domListLang.options[domListLang.selectedIndex].value;
		let cookieDate = getLoginData();
		inputData = JSON.stringify({
			Type: 3,
			Username: cookieDate[0],
			UIC: cookieDate[1],
			lang: langValue
		});
		handleData(
			`${ipAdress}/api/v1/user/settings`,
			changeLang,
			'POST',
			inputData
		);
	});
	// Button for sign out
	domSignOut.addEventListener('click', function() {
		// Clear cookies
		alert('U bent afgemeld');
		setCookie('UN', '', 0);
		setCookie('UIC', '', 0);
		window.location.replace('/');
	});
	// Button for the registration of a new user
	domBTNAddUserMail.addEventListener('click', function() {
		registrationNewUser();
	});
	//BTN for sht down the plate
	domShutDown.addEventListener('click', function() {
		let cookieDate = getLoginData();
		let inputData = JSON.stringify({
			Username: cookieDate[0],
			UIC: cookieDate[1]
		});
		handleData(`${ipAdress}/api/v1/sd`, shutdown, 'POST', inputData);
		alert('Bord is afgesloten');
	});
};
const initSettings = function() {
	//Get the userdata from the server
	let cookieDate = getLoginData();
	let inputData = JSON.stringify({
		Type: 0,
		Username: cookieDate[0],
		UIC: cookieDate[1]
	});
	handleData(
		`${ipAdress}/api/v1/user/settings`,
		getUserdata,
		'POST',
		inputData
	);
};
document.addEventListener('DOMContentLoaded', function() {
	initSettings();
});
