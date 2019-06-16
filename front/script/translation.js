// Tibo Van Craenenbroeck
// tibovc
let domTranslationWordNow = [],
	translationWords = [],
	arrayLenght,
	domTranslationWordNowBTN = [],
	translationWordsBTN = [],
	arrayLenghtBTN;
const recivedTranslation = function(data) {
	//Check if all the words are loaded
	translationWords.push(data);
	if (domTranslationWordNow.length == arrayLenght) {
		//Check if the word == the word in the dom
		for (const word of translationWords) {
			for (const translation of domTranslationWordNow) {
				if (word.Word == translation.innerText) {
					// Set the word into the dom
					translation.innerHTML = word.tWord;
				}
			}
		}
	}
};
const recivedTranslationBTN = function(data) {
	//Check if all the words are loaded
	translationWordsBTN.push(data);
	if (domTranslationWordNowBTN.length == arrayLenghtBTN) {
		//Check if the word == the word in the dom
		for (const word of translationWordsBTN) {
			for (const translation of domTranslationWordNowBTN) {
				if (word.Word == translation.value) {
					// Set the word into the dom
					translation.value = word.tWord;
				}
			}
		}
	}
};
const initTranslation = function() {
	//Load all the words into a var
	const domTranslationWords = document.querySelectorAll('.js-translation');
	const domTranslationWordsBTN = document.querySelectorAll(
		'.js-translation--btn'
	);
	arrayLenght = domTranslationWords.length;
	// Search word for word in the database
	for (const domWord of domTranslationWords) {
		domTranslationWordNow.push(domWord);
		word = domWord.innerText;
		//Send the word to the db
		handleData(
			`${ipAdress}/api/v1/lang/translate/${word}`,
			recivedTranslation
		);
	}
	arrayLenghtBTN = domTranslationWordsBTN.length;
	//Search words from btns in the db
	for (const domWord of domTranslationWordsBTN) {
		domTranslationWordNowBTN.push(domWord);
		word = domWord.value;
		//Send the word to the db
		handleData(
			`${ipAdress}/api/v1/lang/translate/${word}`,
			recivedTranslationBTN
		);
	}
};
document.addEventListener('DOMContentLoaded', function() {
	initTranslation();
});
//Function for the translations of the allerts
const alertData = function(data) {
	alert(data.tWord);
};
const sendAlert = function(word) {
	handleData(`${ipAdress}/api/v1/lang/translate/${word}`, alertData);
};
