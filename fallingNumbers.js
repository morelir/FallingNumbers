const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const DURATION = 3000; // number fall animation duration 

//Create a letter element and setup its falling animation, add the animation to the active animation array, and setup an onfinish handler that will represent a miss.
export function createNumber(container, animations) {
  const numbersIdx = Math.floor(Math.random() * NUMBERS.length);
  const elementId = Date.now();
  const x = Math.random() * 100 + "vw";
  const numContainer = document.createElement("div");
  numContainer.id = elementId;
  numContainer.style.zIndex = 1;
  const num = document.createElement("span");
  const numText = document.createElement("b");
  numText.textContent = NUMBERS[numbersIdx];
  num.appendChild(numText);
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

  //If an animation finishes, we will consider that as a miss, so we will remove it from the active animations array and increment our miss count
  animation.onfinish = function (e) {
    const target = numContainer;
    delete animations[elementId];
    target.classList.add("missed");
  };
}