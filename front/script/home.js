// start socketio
/*const socketio = function() {
	const socket = io.connect(ipAdress);
	socket.on('tempReached', function(data) {
		if (data == true) {
			alert('De temperatuur is bereikt.');
		}
	});
	socket.on('tempNow', function(data) {
		// set the current temp
		domCurrentTemp.innerHTML = data['Temperature'][0]['Input'];
		// Set the data from the db in array for chart
		let time = [];
		let temperature = [];
		for (const temp of data['Temperature']) {
			console.log(temp);
			time.push(temp['Time']);
			temperature.push(temp['Input']);
		}
		// Make the chart
		let timeR = time.reverse();
		let temperatureR = temperature.reverse();
		const myChart = document.querySelector('#chartTemperature');
		var myLineChart = new Chart(myChart, {
			type: 'line',
			data: {
				labels: timeR,
				datasets: [
					{
						label: 'Temperatuur - Tijd',
						data: temperatureR,
						borderColor: 'rgb(255,0,0)',
						fill: false,
						pointBackgroundColor: 'white'
					}
				]
			},
			options: {
				title: {
					display: true,
					text: 'Temperatuur',
					position: 'top'
				},
				scales: {
					yAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: 'Temperatuur'
							}
						}
					],
					xAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: 'Tijd'
							}
						}
					]
				}
			}
		});
	});
};*/
let domBTNStart,
	domBTNStop,
	domCurrentTemp,
	domTargetTemp,
	tempOn = false,
	intervalGetTemp,
	chartTranslationSetup = ['Temperature - Time', 'Temperature', 'Time'],
	chartTranslation = [];
const tranlsateSignleWordSetupFromServer = function(data) {
	chartTranslation.push(data);
};
const tranlsateSignleWordSetup = function() {
	//Search the words in the db
	for (const word of chartTranslationSetup) {
		handleData(
			`${ipAdress}/api/v1/lang/translate/${word}`,
			tranlsateSignleWordSetupFromServer
		);
	}
};
const translateSingleWord = function(searchedWord) {
	for (const word of chartTranslation) {
		if (searchedWord == word.Word) {
			return word.tWord;
		}
	}
};
const tempCheckCelcius = function(temp) {
	if (temp > 1 && temp <= 63) {
		return true;
	} else {
		sendAlert('The temperature must be between 1°C and 63°C');
		return false;
	}
};
const getLoginData = function() {
	let un = getCookie('UN');
	let uic = getCookie('UIC');
	return [un, uic];
};
const stop = function() {
	//Check if the plate is on
	if (tempOn == true) {
		sendAlert('The board has stopped');
		clearInterval(intervalGetTemp);
		tempOn = false;
		domCurrentTemp.innerHTML = '0';
		domBTNStart.value = 'Start';
		domTargetTemp.value = '';
		domBTNStop.style.display = 'none';
	}
};
const tempStop = function(data) {
	stop();
};
//Function for get the current temp --> SocketIO
const getCurrentTemp = function(data) {
	//Check if the stopped automatic
	if (data['Status'] == true) {
		// Change the temp on the screen
		domCurrentTemp.innerHTML = data['Temperature'][0]['Input'];
		// Change the chart
		// Set the data from the db in array for chart
		let time = [];
		let temperature = [];
		for (const temp of data['Temperature']) {
			time.push(temp['Time']);
			temperature.push(temp['Input']);
		}
		// Make the chart
		let timeR = time.reverse();
		let temperatureR = temperature.reverse();
		const myChart = document.querySelector('#chartTemperature');
		var myLineChart = new Chart(myChart, {
			type: 'line',
			data: {
				labels: timeR,
				datasets: [
					{
						label: translateSingleWord('Temperature - Time'),
						data: temperatureR,
						borderColor: 'rgb(252,218,199)',
						fill: false,
						pointBackgroundColor: 'white'
					}
				]
			},
			options: {
				title: {
					display: true,
					text: translateSingleWord('Temperature'),
					position: 'top'
				},
				scales: {
					yAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: translateSingleWord('Temperatuur')
							}
						}
					],
					xAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: translateSingleWord('Time')
							}
						}
					]
				}
			}
		});
	} else {
		stop();
	}
};
const chengeBTN = function() {
	tempOn = true;
	domBTNStart.value = 'Wijzigen';
	domBTNStop.style.display = 'inline';
	// After every 3 seconds get the temp
	intervalGetTemp = setInterval(function() {
		handleData(`${ipAdress}/api/v1/Sensors/ntc/SocketIO`, getCurrentTemp);
	}, 3111);
	domBTNStop.addEventListener('click', function() {
		loginData = getLoginData();
		inputData = JSON.stringify({
			Username: loginData[0],
			UIC: loginData[1]
		});
		// Send data to back
		handleData(`${ipAdress}/api/v1/temp/stop`, tempStop, 'POST', inputData);
	});
};
const tempCheck = function(data) {
	//Check if the temperature is in the database
	if (data['temp'] == true) {
		chengeBTN();
	} else {
		sendAlert("Sorry, we haven't been able to set the temperature");
	}
};
const tempCheckAlreadyInUser = function(data) {
	//Check if there is already a temp in use
	if (data['temp'] == true) {
		domTargetTemp.value = data['DesiredTemp'];
		chengeBTN();
	}
};
const initHome = function() {
	// Put DOM in var
	tranlsateSignleWordSetup();
	domBTNStart = document.querySelector('.js-btnTemp--start');
	domBTNStop = document.querySelector('.js-btnTemp--stop');
	domBTNStop.style.display = 'none';
	domCurrentTemp = document.querySelector('.js-current-temp');
	domTargetTemp = document.querySelector('.js-target-temp');
	//Check if their is already a temp
	let un = getCookie('UN');
	let uic = getCookie('UIC');
	inputData = JSON.stringify({
		Username: un,
		UIC: uic
	});
	handleData(
		`${ipAdress}/api/v1/temp/check`,
		tempCheckAlreadyInUser,
		'POST',
		inputData
	);
	//Check if there is clicked on a btn
	domBTNStart.addEventListener('click', function() {
		targetTemp = domTargetTemp.value;
		if (tempCheckCelcius(targetTemp)) {
			inputData = JSON.stringify({
				Username: un,
				UIC: uic,
				TargetTemp: targetTemp
			});
			if (tempOn) {
				//Change the temp
				handleData(
					`${ipAdress}/api/v1/temp/change`,
					tempCheck,
					'POST',
					inputData
				);
			} else {
				//Send the new temp to the server
				handleData(
					`${ipAdress}/api/v1/temp/new`,
					tempCheck,
					'POST',
					inputData
				);
			}
		} else {
			sendAlert('Please fill in all fields');
		}
	});
};

document.addEventListener('DOMContentLoaded', function() {
	initHome();
});
