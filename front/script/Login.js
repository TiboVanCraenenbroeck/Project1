let domBTNLogin,
	domUsername,
	domPassword,
	domError,
	domBTNForgotPassword,
	domForgotPassword,
	domInputfields,
	domBTNFPLogin,
	domBTNSendNewPassword;
const forgotPasswordSendNewFromServer = function(data) {
	console.log(data);
	domError.innerHTML = data['logindata'];
};
const forgotPasswordSendNew = function() {
	domError = document.querySelector('.js-error');
	let mail = document.querySelector('.js-fp--mail').value;
	if (mail.length > 0) {
		//Send the mailaddress to the server
		inputData = JSON.stringify({
			Mail: mail
		});
		handleData(
			`${ipAdress}/api/v1/user/forgotPassword`,
			forgotPasswordSendNewFromServer,
			'POST',
			inputData
		);
	} else {
		domError.innerHTML = 'Gelieve uw mailadres in te vullen';
	}
};
const forgotPasswordLogin = function() {
	output = `<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<h2 class="c-lead c-lead--lg u-color--black">
			Aanmelden
		</h2>
	</div>
</div>
<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<p class="c-lead c-lead--md js-error">
		</p>
	</div>
</div>
<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<p class="c-lead c-lead--md">
			<label for="username" class="c-label">Gebruikersnaam:</label><input type="text" id="username"
				class="js-username c-input c-input--orange-light" required>
		</p>
	</div>
</div>
<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<p class="c-lead c-lead--md">
			<label for="username" class="c-label">Wachtwoord:</label><input type="password" id="password"
				class="js-password c-input c-input--orange-light" required>
		</p>
	</div>
</div>
<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<p class="c-lead c-lead--md">
			<input type="submit" class="js-button--login c-button c-button--orange" value="Aanmelden">
		</p>
	</div>
</div>
<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<p class="c-lead c-lead--md js-button--forgot-password">
			Wachtwoord vergeten
		</p>
	</div>
</div>`;
	domInputfields.innerHTML = output;
	loginForm();
	//Check if the user click on the btn for forgot password
	domBTNForgotPassword.addEventListener('click', function() {
		//Change the inputfields
		forgotPasswordFields();
	});
};
const forgotPasswordFields = function() {
	output = `<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<h2 class="c-lead c-lead--lg u-color--black">
			Wachtwoord vergeten
		</h2>
	</div>
</div>
<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<p class="c-lead c-lead--md js-error">
		</p>
	</div>
</div>
<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<p class="c-lead c-lead--md">
			<label for="mailadres" class="c-label">Mailadres:</label><input type="email" id="mailadres"
				class="js-fp--mail c-input c-input--orange-light" required>
		</p>
	</div>
</div>
<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<p class="c-lead c-lead--md">
			<input type="submit" class="js-button--fp-send c-button--orange" value="Wachtwoord verzenden">
		</p>
	</div>
</div>
<div class="o-layout o-layout--gutter o-layout--justify-center o-layout--align-center">
	<div class="o-layout__item u-2-of-3-bp2 u-1-of-2-bp3">
		<p class="c-lead c-lead--md c-button js-button--fp-login">
			Aanmelden
		</p>
	</div>
</div>`;
	domInputfields.innerHTML = output;
	domBTNFPLogin = document.querySelector('.js-button--fp-login');
	//Check if he switched to the login
	domBTNFPLogin.addEventListener('click', function() {
		forgotPasswordLogin();
	});
	// Check if the user clicked on the button forgot password
	domBTNSendNewPassword = document.querySelector('.js-button--fp-send');
	domBTNSendNewPassword.addEventListener('click', function() {
		forgotPasswordSendNew();
	});
};
const loginComplete = function(data) {
	// Check if the user exists
	if (data['logindata'][0] == 0) {
		domError.innerHTML = data['logindata'][1];
	} else {
		setCookie('UN', data['logindata'][1][0].Username, 365);
		setCookie('UIC', data['logindata'][1][0].UIC, 365);
		window.location.replace('/home');
	}
};
const accountCheck = function(data) {
	//Check if the tuser has a valid login
	if (data['logindata'] == 1) {
		window.location.replace('/home');
	} else {
		loginForm();
	}
};
const loginForm = function() {
	domUsername = document.querySelector('.js-username');
	domPassword = document.querySelector('.js-password');
	domBTNLogin = document.querySelector('.js-button--login');
	domBTNForgotPassword = document.querySelector(
		'.js-button--forgot-password'
	);
	domError = document.querySelector('.js-error');
	domInputfields = document.querySelector('.js-inputfields');
	//Check if the user click on the loginbtn
	domBTNLogin.addEventListener('click', function() {
		let username = domUsername.value;
		let password = domPassword.value;
		inputData = JSON.stringify({
			Username: username,
			Password: password
		});
		handleData(
			`${ipAdress}/api/v1/user/login`,
			loginComplete,
			'POST',
			inputData
		);
	});
	//Check if the user click on the btn for forgot password
	domBTNForgotPassword.addEventListener('click', function() {
		//Change the inputfields
		forgotPasswordFields();
	});
};
const initLogin = function() {
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
		loginForm();
	}
};
document.addEventListener('DOMContentLoaded', function() {
	initLogin();
});
