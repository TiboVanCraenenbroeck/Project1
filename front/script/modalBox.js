// Get the modal
let modal, btn, span;
const initBTN = function() {
	modal = document.querySelector(".js-box")
	// Get the button that opens the modal
	btn = document.querySelector('.js-modal-box--open');
	// Get the <span> element that closes the modal
	span = document.getElementsByClassName('js-close')[0];
	// When the user clicks the button, open the modal
	btn.onclick = function() {
		modal.style.display = 'block';
	};
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = 'none';
	};
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
};
document.addEventListener('DOMContentLoaded', function() {
	initBTN();
});
