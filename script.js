import { createBucket } from "./bucket.js";
import { fallingNumbers } from "./fallingNumbers.js";

//game setup
const LETTERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const DURATION = 3000; // letter fall animation duration
loadGame();

function loadGame() {
  var button = document.createElement("button");
  button.textContent = "Start Game";
  var main = document.querySelector("main");
  main.appendChild(button);
  var rules = document.createElement("p");
  rules.textContent =
    "Numbers will fall... drag the bucket and catch numbers from 1 to 10 before they hit the ground";
  main.appendChild(rules);
  button.addEventListener("click", function startIt(e) {
    main.textContent = "";
    playGame();
  });
}

function playGame() {
  document.documentElement.classList.add("playing");
  let nextNumber = 1;
  const intervalIds = [];
  const animations = {};
  let game = { isOn: true };
  const main = document.querySelector("#main");
  const header = document.querySelector("header");
  let draggable = createBucket(main);
  initNext();
  fallingNumbers(main, game, animations);

  //Periodically remove missed elements, and lower the interval between falling elements
  intervalIds.push(
    setInterval(function () {
      cleanup();
    }, 20000)
  );
  function cleanup() {
    [].slice.call(main.querySelectorAll(".missed")).forEach(function (missed) {
      main.removeChild(missed);
    });
  }

  //Periodically does for all dynamic falling numbers, if Draggable(bucket) div is collision with one of them, than does the appropriate action
  intervalIds.push(
    setInterval(function () {
      const keys = Object.keys(animations);
      for (const key of keys) {
        const { element: target, animation } = animations[key];
        if (detectCollision(draggable, target)) {
          const targetText = target.querySelector("b");
          const num = +targetText.textContent;
          if (nextNumber !== num) {
            return gameOver();
          } else if (num === 10) {
            return win();
          }
          nextNumber++;
          delete animations[key];
          animation.pause();

          targetText.animate(
            [
              {
                opacity: 1,
              },
              {
                opacity: 0,
              },
            ],
            {
              easing: "ease-out",
              fill: "both",
            }
          );
          target.classList.add("missed");
          stepNextNumber();
        }
      }
    }, 0)
  );

  // check if draggable div hovers over a target div
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

  function initNext() {
    // const nextNumber = document.querySelector("header .next-number span");
    // nextNumber.textContent = "1";
    const next = document.createElement("p");
    const span = document.createElement("span");
    next.innerText = "Next: ";
    next.classList.add("next-number");
    span.innerText = nextNumber;
    next.appendChild(span);
    header.appendChild(next);
  }

  function stepNextNumber() {
    const spanNextNumber = document.querySelector("header .next-number span");
    spanNextNumber.innerText = nextNumber;
  }

  function win() {
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
    p.textContent = "You Win!";
    const button = document.createElement("button");
    button.textContent = "Start Again";
    endGame.append(p, button);

    button.addEventListener("click", function () {
      document.querySelector(".end-game").classList.remove("indeed");
      endGame.textContent = "";
      playGame();
    });
  }

  //End game and show screen
  function gameOver() {
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
    p.textContent = "Game Over";
    const button = document.createElement("button");
    button.textContent = "Start Again ";
    endGame.append(p, button);

    button.addEventListener("click", function () {
      document.querySelector(".end-game").classList.remove("indeed");
      endGame.textContent = "";
      playGame();
    });
  }
}
