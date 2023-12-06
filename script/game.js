import { SimpleTimer,createTimer} from "./timer.js";
import { createBucket } from "./bucket.js";
import { fallingNumbers } from "./fallingNumbers.js";
import { createNext, nextNumber, stepNextNumber } from "./nextNumber.js";

loadGame();

function loadGame() {
  const button = document.querySelector(".start-screen button");
  button.addEventListener("click", function startIt(e) {
    document.querySelector(".start-screen").classList.add("hide-display");
    document.querySelector(".game-screen").classList.remove("hide-display");
    playGame();
  });
}

function playGame() {
  const intervalIds = [];
  const animations = {};
  const game = { isOn: true };
  const gameScreen = document.querySelector(".game-screen");
  const winScreen = document.querySelector(".win-screen");
  const endScreen = document.querySelector(".end-screen");
  const bucket = createBucket(gameScreen);
  createNext();
  // const timer = new SimpleTimer(intervalIds);
  // timer.start();
  createTimer(intervalIds)
  fallingNumbers(gameScreen, game, animations);

  //Periodically checking collision between dynamic falling numbers elements and bucket element
  intervalIds.push(
    setInterval(function () {
      checkingCollision();
    }, 0)
  );

  function checkingCollision() {
    const keys = Object.keys(animations);
    for (const key of keys) {
      const { element: target, animation } = animations[key];
      if (detectCollision(bucket, target)) {
        const targetText = target.querySelector("span");
        const num = +targetText.textContent;
        if (nextNumber !== num) {
          return end();
        } else if (num === 10) {
          return win();
        }
        delete animations[key];
        animation.pause();
        target.classList.add("hidden");
        stepNextNumber();
      }
    }
  }

  // Detects collision between bucket element and falling number element
  function detectCollision(bucket, fallingNumber) {
    const bucketRect = bucket.getBoundingClientRect();
    const fallingNumberRect = fallingNumber.getBoundingClientRect();
    return (
      bucketRect.top < fallingNumberRect.bottom &&
      bucketRect.bottom > fallingNumberRect.top &&
      bucketRect.left < fallingNumberRect.right &&
      bucketRect.right > fallingNumberRect.left
    );
  }

  //Periodically remove hidden elements
  intervalIds.push(
    setInterval(function () {
      cleanupHiddens();
    }, 20000)
  );

  function cleanupHiddens() {
    [...gameScreen.querySelectorAll(".hidden")].forEach(function (hidden) {
      gameScreen.removeChild(hidden);
    });
  }

  function win() {
    game.isOn = false;
    gameScreen.textContent=""
    gameScreen.classList.add('hide-display')
    clearGameResources();
    showWinScreen();
  }

  function end() {
    game.isOn = false;
    gameScreen.textContent=""
    gameScreen.classList.add('hide-display')
    clearGameResources();
    showEndScreen();
  }

  function showWinScreen() {
    winScreen.classList.remove("hide-display");
    const button = winScreen.querySelector("button");
    button.addEventListener("click",clickHandler)
    function clickHandler() {
      winScreen.classList.add("hide-display");
      gameScreen.classList.remove('hide-display')
      removeAllListeners(button);
      playGame();
    }
  }

  function showEndScreen() {
    endScreen.classList.remove("hide-display");
    const button = endScreen.querySelector("button");
    button.addEventListener("click",clickHandler)
    function clickHandler() {
      endScreen.classList.add("hide-display");
      gameScreen.classList.remove('hide-display')
      removeAllListeners(button);
      playGame();
    }
  }

  function clearGameResources() {
    for (let i = 0; i < intervalIds.length; i++) {
      clearInterval(intervalIds[i]);
    }
    document.getAnimations().forEach(function (anim) {
      anim.pause();
    });
  }
  
}

function removeAllListeners(element) {
  const newElement = element.cloneNode(true);
  element.replaceWith(newElement);
}
