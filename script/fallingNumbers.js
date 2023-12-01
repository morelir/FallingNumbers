const DURATION = 3000; //Fall animation duration
const ROUND_INTERVAL = 4000; //Interval between rounds
const NUMBER_OF_FALLING_NUMBERS = window.innerWidth > 480 ? 20 : 8; //Number of falling numbers each round

//start the numbers falling
export function fallingNumbers(container, game, animations) {
  if (game.isOn) {
    for (let i = 0; i < NUMBER_OF_FALLING_NUMBERS; i++) {
      setTimeout(() => {
        if (game.isOn) {
          createNumber(container, animations);
        }
      }, 100 * i);
    }
    setTimeout(function () { //Next round
      fallingNumbers(container, game, animations);
    }, ROUND_INTERVAL);
  }
}

//Create a number element and setup its falling animation, add the animation to the active animation array
export function createNumber(container, animations) {
  const elementId = Date.now();
  const x = Math.random() * (window.innerWidth > 480 ? 95 : 90) + "vw";
  const numContainer = document.createElement("div");
  numContainer.id = elementId;
  numContainer.style.zIndex = 1;
  const num = document.createElement("span");
  num.textContent = Math.floor(Math.random() * 10) + 1;
  numContainer.appendChild(num);
  container.appendChild(numContainer);
  const animation = numContainer.animate(
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
    element: numContainer,
  };

  animation.playbackRate = 1;

  //If an animation finishes, we will remove it from the active animations array
  animation.onfinish = function (e) {
    const target = numContainer;
    target.classList.add("hidden");
    delete animations[elementId];
  };
}
