loadGame();

function loadGame() {
  var button = document.createElement("button");
  button.textContent = "Start Game";
  var main = document.querySelector("main");
  main.appendChild(button);
  var rules = document.createElement("p");
  rules.textContent =
    "Numbers will fall... if you have a keyboard (preferably with a numpad), press the correct keys to knock them away before they hit the ground";
  main.appendChild(rules);
  button.addEventListener("click", function startIt(e) {
    document.querySelector(".start-game").classList.add("indeed")
    main.textContent = "";
    playGame();
  });
}

// function createCustomCursor() {
//   const main = document.querySelector("#main");
//   const cursor = document.createElement("div");
//   cursor.className = "custom-cursor";
//   main.appendChild(cursor);

//   main.addEventListener("mousemove", function (e) {
//     const x = e.clientX;
//     const y = e.clientY;
//     cursor.style.transform = `translate(${x - 20}px, ${y - 120}px)`;
//   });
// }

function playGame(replay) {
  // createCustomCursor();

  document.documentElement.classList.add("playing");
  var LETTERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  let orderCount = 1;
  var animations = {};
  var gameOn = true;
  var timeOffset = 500; // 2000 interval between letters starting, will be faster over time
  var DURATION = 2000; //10000
  var main = document.querySelector("#main");
  var header = document.querySelector("header");
  var scoreElement = document.getElementById("score");
  var score = parseFloat(scoreElement.textContent);
  var rate = 1;
  var RATE_INTERVAL = 0; //playbackRate will increase by .05 for each letter... so after 20 letters, the rate of falling will be 2x what it was at the start
  var misses = 0;
  createBucket(animations);

  LETTERS.forEach(function (l) {
    // animations[l] = [];
  });

  var audioCtx;
  var oscillator;
  var gainNode;

  function createBucket() {
    var mousePosition;
    var offset = [0, 0];
    var draggable;
    var isDown = false;

    const main = document.getElementById("main");
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

    draggable.addEventListener(
      "mousedown",
      function (e) {
        isDown = true;
        offset = [
          draggable.offsetLeft - e.clientX,
          draggable.offsetTop - e.clientY,
        ];
        e.preventDefault();
      },
      true
    );

    document.addEventListener(
      "mouseup",
      function () {
        isDown = false;
      },
      true
    );

    main.addEventListener(
      "mousemove",
      function (event) {
        event.preventDefault();
        if (isDown) {
          mousePosition = {
            x: event.clientX,
            y: event.clientY,
          };
          draggable.style.left = mousePosition.x + offset[0] + "px";
          draggable.style.top = mousePosition.y + offset[1] + "px";
        }
      },
      true
    );

    setInterval(function () {
      Object.keys(animations).forEach(function (key) {
        const { element: target, animation } = animations[key];
        if (isOverlapping(draggable, target)) {
          // execute when the draggable div hovers over a target div
          const targetText = target.querySelector("b");
          const num = +targetText.textContent;
          if (orderCount !== num) {
            gameOver();
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
        }
      });
    }, 100);

    function isOverlapping(draggable, target) {
      const rect1 = draggable.getBoundingClientRect();
      const rect2 = target.getBoundingClientRect();

      const fixedNum = 20;
      return (
        rect1.top < rect2.bottom + fixedNum + 50 &&
        rect1.top > rect2.bottom - fixedNum &&
        rect1.bottom > rect2.top &&
        rect1.left < rect2.right &&
        rect1.right > rect2.left
      );
    }
  }

  //Create a letter element and setup its falling animation, add the animation to the active animation array, and setup an onfinish handler that will represent a miss.
  function create() {
    var lettersIdx = Math.floor(Math.random() * LETTERS.length);
    const elementId = Date.now();
    var x = Math.random() * 85 + "vw";
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

    // animations[LETTERS[lettersIdx]].splice(0, 0, {
    //   animation: animation,
    //   element: container,
    // });
    animations[elementId] = {
      animation: animation,
      element: container,
    };

    rate = rate + RATE_INTERVAL;
    animation.playbackRate = rate;

    //If an animation finishes, we will consider that as a miss, so we will remove it from the active animations array and increment our miss count
    animation.onfinish = function (e) {
      // var target = container;
      // var char = target.textContent;
      delete animations[elementId];
      console.log("missed");
      // animations[char].pop();
      // target.classList.add("missed");
      // handleMisses();
    };
  }

  //When a miss is registered, check if we have reached the max number of misses
  function handleMisses() {
    misses++;
    var missedMarker = document.querySelector(".misses:not(.missed)");
    console.log("miss");
    if (missedMarker) {
      missedMarker.classList.add("missed");
    } else {
      gameOver();
    }
  }

  //End game and show screen
  function gameOver() {
    gameOn = false;
    clearInterval(cleanupInterval);
    getAllAnimations().forEach(function (anim) {
      anim.pause();
    });

    //Could use Web Animations API here, but showing how you can use a mix of Web Animations API and CSS transistions
    // document.body.removeEventListener('keypress', onPress);
    // oscillator.stop(0);
    document.querySelector(".game-over").classList.add("indeed");

    var button = document.createElement("button");
    button.textContent = "Start Again";
    var div = document.querySelector(".game-over");
    div.appendChild(button);
    
    button.addEventListener("click",function(){
      const main = document.querySelector("#main");
      // main.textContent="";
      while (main.firstChild) {
        console.log(1)
        main.removeChild(main.lastChild);
      }
      document.querySelector(".game-over").classList.remove("indeed");
      
      playGame();
    })
  }

  //Periodically remove missed elements, and lower the interval between falling elements
  var cleanupInterval = setInterval(function () {
    timeOffset = (timeOffset * 4) / 5;
    cleanup();
  }, 20000);
  function cleanup() {
    [].slice.call(main.querySelectorAll(".missed")).forEach(function (missed) {
      main.removeChild(missed);
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

  //On key press, see if it matches an active animating (falling) letter. If so, pop it from active array, pause it (to keep it from triggering "finish" logic), and add an animation on inner element with random 3d rotations that look like the letter is being kicked away to the distance. Also update score.
  // function onPress(e) {
  //   var char = e.key;
  //   if (char.length === 1) {
  //     char = char.toLowerCase();
  //     if (animations[char] && animations[char].length) {
  //       var popped = animations[char].pop();
  //       popped.animation.pause();
  //       var target = popped.element.querySelector("b");
  //       var degs = [
  //         Math.random() * 1000 - 500,
  //         Math.random() * 1000 - 500,
  //         Math.random() * 2000 - 1000,
  //       ];
  //       target.animate(
  //         [
  //           {
  //             transform: "scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
  //             opacity: 1,
  //           },
  //           {
  //             transform:
  //               "scale(0) rotateX(" +
  //               degs[0] +
  //               "deg) rotateY(" +
  //               degs[1] +
  //               "deg) rotateZ(" +
  //               degs[2] +
  //               "deg)",
  //             opacity: 0,
  //           },
  //         ],
  //         {
  //           duration: Math.random() * 500 + 850,
  //           easing: "ease-out",
  //           fill: "both",
  //         }
  //       );
  //       addScore();
  //       playSound(LETTERS.indexOf(char) / LETTERS.length);
  //       header.textContent += char;
  //     }
  //   }
  // }
  // function addScore() {
  //   score++;
  //   scoreElement.textContent = score;
  // }

  // document.body.addEventListener("keypress", onPress);

  //start the letters falling... create the element+animation, and setup timeout for next letter to start
  function setupNextLetter() {
    if (gameOn) {
      create();
      setTimeout(function () {
        setupNextLetter();
      }, timeOffset);
    }
  }
  setupNextLetter();

  // var isPlaying;
  // var maxVol = .025;
  // var minVol = 0.0000001;
  // function setupAudio() {

  //   if (window.AudioContext || window.webkitAudioContext) {
  //     audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  //     oscillator = audioCtx.createOscillator();
  //     gainNode = audioCtx.createGain();

  //     oscillator.connect(gainNode);

  //     // set options for the oscillator
  //     oscillator.type = 'sawtooth';
  //     oscillator.frequency.value = 880; // value in hertz
  //     oscillator.detune.value = 100; // value in cents
  //     oscillator.start(0);

  //     gainNode.gain.value = minVol;

  //     document.querySelector('footer button').addEventListener('click', function(e) {
  //       if (isPlaying) {
  //         gainNode.disconnect(audioCtx.destination);
  //         e.currentTarget.textContent = 'Sound Off';
  //       } else {
  //         gainNode.connect(audioCtx.destination);
  //         e.currentTarget.textContent = 'Sound On';
  //       }

  //       isPlaying = !isPlaying;
  //     });
  //   }
  // }
  // function playSound(offset) {
  //   if (isPlaying) {
  //     gainNode.gain.setValueAtTime(maxVol, audioCtx.currentTime);
  //     oscillator.frequency.setValueAtTime(440 + (offset * 440), audioCtx.currentTime);
  //     gainNode.gain.linearRampToValueAtTime(minVol, audioCtx.currentTime + .4);
  //     oscillator.frequency.linearRampToValueAtTime(220 - (offset * 110), audioCtx.currentTime + .4);
  //   }
  // }

  // setupAudio();
}

// if (isDown) {
//   mousePosition = {
//     x: event.clientX,
//     y: event.clientY,
//   };
//   let newX = mousePosition.x - offset[0];
//   let newY = mousePosition.y - offset[1];
//   // console.log("mousePosition.x:"+mousePosition.x , mousePosition.y)
//   // console.log("offset[0]:"+offset[0],offset[1])
//   // console.log("newX:"+newX,newY)

//   console.log("div:"+div.offsetWidth,"main:"+main.offsetWidth)
//   console.log(offset[0],offset[1])
//   if (newX >= 0 && newX <= main.offsetWidth - div.offsetWidth) {
//     div.style.left = newX + "px";
//   }

//   if (newY >= 0 && newY <= main.offsetHeight - div.offsetHeight) {
//     div.style.top = newY + "px";
//   }
// }
