let ipAdress;
const init = function() {
	ipAdress = 'http://' + window.location.hostname + ':5000';
};
document.addEventListener('DOMContentLoaded', function() {
	init();
});
