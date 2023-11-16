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
    document.querySelector(".start-game").classList.add("indeed");
    main.textContent = "";
    playGame();
  });
}

function playGame(replay) {
  document.documentElement.classList.add("playing");
  const LETTERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  let orderCount = 1;
  const animations = {};
  let gameOn = true;
  var timeOffset = 3000; // interval between letters starting, will be faster over time
  var DURATION = 3000; 
  var main = document.querySelector("#main");
  let draggable;
  var rate = 1;
  var RATE_INTERVAL = 0; //playbackRate will increase by .05 for each letter... so after 20 letters, the rate of falling will be 2x what it was at the start
  const intervalIds = [];
  createBucket();

  function createBucket() {
    let mousePosition;
    let offset = [0, 0];
    let isDown = false;

    draggable = document.createElement("div");
    draggable.style.position = "absolute";
    draggable.style.left = "50%";
    draggable.style.top = "100%";
    draggable.style.width = "100px";
    draggable.style.height = "100px";
    draggable.style.transform = "translate(-50%,-100%)";
    draggable.style.background = "url(./images/bucket.png)";
    draggable.style.backgroundSize = "100px 100px";
    draggable.style.zIndex = "1";
    draggable.style.cursor = "grab";
    main.appendChild(draggable);

    draggable.addEventListener("mousedown", function (event) {
      isDown = true;
      offset = [
        draggable.offsetLeft - event.clientX,
        draggable.offsetTop - event.clientY,
      ];
      draggable.style.cursor = "grabbing";
      event.preventDefault();
    });

    document.addEventListener("mouseup", function () {
      isDown = false;
      draggable.style.cursor = "grab";
    });

    document.addEventListener("mousemove", function (event) {
      event.preventDefault();
      if (isDown) {
        mousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        draggable.style.left = mousePosition.x + offset[0] + "px";
        draggable.style.top = mousePosition.y + offset[1] + "px";
      }
    });
  }

  //Create a letter element and setup its falling animation, add the animation to the active animation array, and setup an onfinish handler that will represent a miss.
  function create() {
    var lettersIdx = Math.floor(Math.random() * LETTERS.length);
    const elementId = Date.now();
    var x = Math.random() * 100 + "vw";
    var container = document.createElement("div");
    container.id = elementId;
    container.style.zIndex = 1;
    var letter = document.createElement("span");
    var letterText = document.createElement("b");
    letterText.textContent = LETTERS[lettersIdx];
    letter.appendChild(letterText);
    container.appendChild(letter);
    main.appendChild(container);
    var animation = container.animate(
      [
        { transform: "translate3d(" + x + ",-2.5vh,0)" },
        { transform: "translate3d(" + x + ",82.5vh,0)" },
      ],
      {
        duration: DURATION,
        easing: "linear",
        fill: "both",
      }
    );

    animations[elementId] = {
      animation: animation,
      element: container,
    };

    rate = rate + RATE_INTERVAL;
    animation.playbackRate = rate;

    //If an animation finishes, we will consider that as a miss, so we will remove it from the active animations array and increment our miss count
    animation.onfinish = function (e) {
      const target = container;
      delete animations[elementId];
      target.classList.add("missed");
    };
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
      endGame.removeChild(button);
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

  //Periodically remove missed elements, and lower the interval between falling elements
  intervalIds.push(
    setInterval(function () {
      timeOffset = (timeOffset * 4) / 5;
      cleanup();
    }, 20000)
  );
  function cleanup() {
    [].slice.call(main.querySelectorAll(".missed")).forEach(function (missed) {
      main.removeChild(missed);
    });
  }

  //Periodically do for all dynamic falling numbers, if Draggable(bucket) div is over a target div(number)
  intervalIds.push(
    setInterval(function () {
      const keys = Object.keys(animations);
      for (const key of keys) {
        const { element: target, animation } = animations[key];
        if (isOverlapping(draggable, target)) {
          // execute when the draggable div hovers over a target div
          const targetText = target.querySelector("b");
          const num = +targetText.textContent;
          if (orderCount !== num) {
            gameOver();
          } else if (num === 10) {
            win();
          }
          orderCount++;
          console.log("Draggable div is over a target div");
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
        }
      }
    }, 0)
  );

  // check if draggable div hovers over a target div
  function isOverlapping(draggable, target) {
    const rect1 = draggable.getBoundingClientRect();
    const rect2 = target.getBoundingClientRect();
    
    return (
      rect1.top < rect2.bottom  &&
      rect1.bottom > rect2.top &&
      rect1.left < rect2.right  &&
      rect1.right > rect2.left 
    );
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
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          if (gameOn) {
            create();
          }
        }, 100 * i);
      }
      setTimeout(function () {
        setupNextLetter();
      }, timeOffset);
    }
  }
  setupNextLetter();
}
