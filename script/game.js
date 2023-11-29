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
  const main = document.querySelector("#main");
  const header = document.querySelector("header");
  const draggable = createBucket(main);
  createNext();
  fallingNumbers(main, game, animations);

  //Periodically remove hidden elements, and lower the interval between falling elements
  intervalIds.push(
    setInterval(function () {
      cleanup();
    }, 20000)
  );
  function cleanup() {
    [...main.querySelectorAll(".hidden")].forEach(function (hidden) {
      main.removeChild(hidden);
    });
  }

  //Periodically does for all dynamic falling numbers, if Draggable(bucket) div is collision with one of them, than does the appropriate action
  intervalIds.push(
    setInterval(function () {
      const keys = Object.keys(animations);
      for (const key of keys) {
        const { element: target, animation } = animations[key];
        if (detectCollision(draggable, target)) {
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
    }, 0)
  );

  // Detects collision between draggable(bucket) element and fallingNumber element
  function detectCollision(draggable, fallingNumber) {
    const draggableRect = draggable.getBoundingClientRect();
    const fallingNumberRect = fallingNumber.getBoundingClientRect();

    return (
      draggableRect.top < fallingNumberRect.bottom &&
      draggableRect.bottom > fallingNumberRect.top &&
      draggableRect.left < fallingNumberRect.right &&
      draggableRect.right > fallingNumberRect.left
    );
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
