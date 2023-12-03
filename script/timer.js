let timer;
const timerContainer = document.querySelector("header .timer");
const timerText = document.querySelector("header .timer span");

export function createTimer(intervalIds) {
  timer = 0;
  timerContainer.classList.remove("hide-display");
  timerText.textContent = timer;
  intervalIds.push(setInterval(startTimer,1000));
}

function startTimer(intervalIds) {
  timer+=1;
  timerText.textContent=timer;
}



export class SimpleTimer {
  constructor(intervalIds) {
    this.intervalIds=intervalIds;
    this.currentTime = 0;
    this.timerContainer = document.querySelector("header .timer");
    this.timerText = document.querySelector("header .timer span");

  }

  start = () => {
    this.timerContainer.classList.remove("hide-display");
    this.timerText.textContent = this.currentTime;
    this.intervalIds.push(setInterval(() => {
      this.currentTime += 1;
      this.timerText.textContent = this.currentTime; 
    }, 1000));
  }

  stop = () => {
    clearInterval(this.timerInterval);
  }
}

// // Create an instance of the SimpleTimer class
// const timer = new SimpleTimer();

// // Start the timer
// timer.start();

// // Example: Stop the timer after 10 seconds
// setTimeout(() => {
//   timer.stop();
// }, 10000);