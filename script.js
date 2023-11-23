import {createBucket} from "./bucket.js"
import { createNumber } from "./fallingNumbers.js";

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

function playGame(replay) {
  document.documentElement.classList.add("playing");
  // const LETTERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  // const DURATION = 3000; // letter fall animation duration 
  let nextNumber = 1;
  const intervalIds = [];
  const animations = {};
  let gameOn = true;
  var roundInterval = 3000; // interval between rounds
  var main = document.querySelector("#main");
  const roundNumOfLetters = window.innerWidth > 480 ? 16 : 6;
  let draggable = createBucket(main);
  initNext();

  


  //Periodically remove missed elements, and lower the interval between falling elements
  intervalIds.push(
    setInterval(function () {
      roundInterval = (roundInterval * 4) / 5;
      cleanup();
    }, 20000)
  );
  function cleanup() {
    [].slice.call(main.querySelectorAll(".missed")).forEach(function (missed) {
      main.removeChild(missed);
    });
  }

  //Periodically does for all dynamic falling numbers, if Draggable(bucket) div is over on one of them, than does the appropriate action
  intervalIds.push(
    setInterval(function () {
      const keys = Object.keys(animations);
      for (const key of keys) {
        const { element: target, animation } = animations[key];
        if (isOverlapping(draggable, target)) {
          // execute when the draggable div hovers over a target div
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
  function isOverlapping(draggable, target) {
    const rect1 = draggable.getBoundingClientRect();
    const rect2 = target.getBoundingClientRect();

    return (
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top &&
      rect1.left < rect2.right &&
      rect1.right > rect2.left
    );
  }

  function initNext() {
    const nextNumber = document.querySelector("header .next-number span");
    nextNumber.textContent = "1";
    // const next = document.createElement("p");
    // const span = document.createElement("span");
    // next.innerText="Next: ";
    // next.classList.add("next-number");
    // span.innerText=nextNumber;
    // next.appendChild(span)
    // header.appendChild(next)
  }
  

  function stepNextNumber() {
    const spanNextNumber = document.querySelector("header .next-number span");
    spanNextNumber.innerText = nextNumber;
  }

  

  function win() {
    gameOn = false;
    for (let i = 0; i < intervalIds.length; i++) {
      clearInterval(intervalIds[i]);
    }
    getAllAnimations().forEach(function (anim) {
      anim.pause();
    });

    const endGame = document.querySelector(".end-game");
    endGame.classList.add("indeed");
    main.textContent = "";
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
    gameOn = false;
    for (let i = 0; i < intervalIds.length; i++) {
      clearInterval(intervalIds[i]);
    }
    getAllAnimations().forEach(function (anim) {
      anim.pause();
    });

    const endGame = document.querySelector(".end-game");
    endGame.classList.add("indeed");
    main.textContent = "";
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

  //Firefox 48 supports document.getAnimations as per latest spec, Chrome 52 and polyfill use older spec
  function getAllAnimations() {
    if (document.getAnimations) {
      return document.getAnimations();
    } else if (document.timeline && document.timeline.getAnimations) {
      return document.timeline.getAnimations();
    }
    return [];
  }

  //start the letters falling... create the element+animation, and setup timeout for next letter to start
  function setupNextLetter() {
    if (gameOn) {
      for (let i = 0; i < roundNumOfLetters; i++) {
        setTimeout(() => {
          if (gameOn) {
            createNumber(main,animations);
          }
        }, 100 * i);
      }
      setTimeout(function () {
        setupNextLetter();
      }, roundInterval);
    }
  }
  setupNextLetter();
}
