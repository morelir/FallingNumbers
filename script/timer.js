let timer;
const timerContainer = document.querySelector("header .timer");
const timerText = document.querySelector("header .timer span");

export function createTimer(intervalIds) {
  timer = 0;
  timerContainer.classList.remove("hide-display");
  timerText.textContent = timer;
  
  intervalIds.push(setInterval(startTimer, 1000));
}

function startTimer() {
  document.querySelector("header .timer span").textContent = timer++;
}
