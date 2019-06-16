let domBtnRegistratieKnop, domInputError;
const registratieComplete = function(data) {
	console.log(data);
};
const init = function() {
	console.log('JS registration geladen!');
	domBtnRegistratieKnop = document.querySelector('.js-btn-registreren');
	domInputError = document.querySelector('.js-input-error');
	domBtnRegistratieKnop.addEventListener('click', function() {
		let mail = document.querySelector('.js-input-mail').value;
		if (mail.length>0) {
			inputData = JSON.stringify({
				Mail: mail
			});
			handleData(
				`http://169.254.10.1:5000/api/v1/user/new/insert`,
				registratieComplete,
				'POST',
				inputData
			);
		} else {
			domInputError.innerHTML = 'Beide wachtwoorden moeten overeenkomen!';
		}
	});
};

document.addEventListener('DOMContentLoaded', function() {
	init();
});
