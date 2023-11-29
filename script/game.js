import { createBucket } from "./bucket.js";
import { fallingNumbers } from "./fallingNumbers.js";
import { createNext, nextNumber, stepNextNumber } from "./nextNumber.js";

loadGame();

function loadGame() {
  const button = document.createElement("button");
  button.textContent = "Start Game";
  const main = document.querySelector("main");
  main.appendChild(button);
  const rules = document.createElement("p");
  rules.textContent =
    "Numbers will fall... drag the bucket and catch numbers from 1 to 10 in sequential order";
  main.appendChild(rules);
  button.addEventListener("click", function startIt(e) {
    main.textContent = "";
    playGame();
  });
}

function playGame() {
  const intervalIds = [];
  const animations = {};
  const game = { isOn: true };
  const main = document.querySelector("main");
  const header = document.querySelector("header");
  const bucket = createBucket(main);
  createNext();
  fallingNumbers(main, game, animations);

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
          return gameOver();
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
    [...main.querySelectorAll(".hidden")].forEach(function (hidden) {
      main.removeChild(hidden);
    });
  }

  function win() {
    gameIsEnded("You Win!");
  }

  function gameOver() {
    gameIsEnded("Game Over");
  }

  //Clear resources and show end game screen
  function gameIsEnded(text) {
    game.isOn = false;
    for (let i = 0; i < intervalIds.length; i++) {
      clearInterval(intervalIds[i]);
    }
    document.getAnimations().forEach(function (anim) {
      anim.pause();
    });

    const endGame = document.querySelector(".end-game");
    endGame.classList.add("indeed");
    main.textContent = "";
    header.textContent = "";
    const p = document.createElement("p");
    p.textContent = text;
    const button = document.createElement("button");
    button.textContent = "Start Again";
    endGame.append(p, button);

    button.addEventListener("click", function () {
      endGame.classList.remove("indeed");
      endGame.textContent = "";
      playGame();
    });
  }
}
