let domContentTemperature;
const verwerkData = function(data) {
	console.log(data['Temperature']);
	let display = '';
	let time = [];
	let temperature = [];
	for (const temp of data['Temperature']) {
		time.push(temp['Time']);
		temperature.push(temp['Input']);
	}
	let timeR = time.reverse();
	let temperatureR = temperature.reverse();
	domContentTemperature.innerHTML = display;
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
};
const loadData = function() {
	handleData(`http://169.254.10.1:5000/api/v1/Sensors/NTC`, verwerkData);
};
const initTemperature = function() {
	domContentTemperature = document.querySelector('.js-temperatuur');
	setInterval(() => {
		loadData();
	}, 5000);
};
document.addEventListener('DOMContentTemperatureLoaded', function() {
	console.log('DOM loaded');
	initTemperature();
});
