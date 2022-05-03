const AskButton = document.getElementById('Ask');
const BackButton = document.getElementById('Back');
const container = document.getElementById('container');

AskButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

BackButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});
