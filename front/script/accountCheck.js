const accountCheck = function(data) {
	//Check if the tuser has a valid login
	if (data['logindata'] == 0) {
		window.location.replace('/');
	}
};
const initAccountCheck = function() {
	//Ckech if the user already logged on to this computer
	let un = getCookie('UN');
	let uic = getCookie('UIC');
	inputData = JSON.stringify({
		Username: un,
		UIC: uic
	});
	if (un.length > 0 && uic.length > 0) {
		//Check if the data is correct
		handleData(
			`${ipAdress}/api/v1/user/login/check`,
			accountCheck,
			'POST',
			inputData
		);
	} else {
		window.location.replace('/');
	}
};
document.addEventListener('DOMContentLoaded', function() {
	initAccountCheck();
});
