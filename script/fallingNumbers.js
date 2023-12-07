const DURATION = 3000; //Fall animation duration
let ROUND_INTERVAL = 0; //Interval between rounds
const INTERVAL_BETWEEN_NUMS = window.innerWidth > 800 ? 100 : 200; //Interval between numbers
let X_AXIS_POINTS = []
let NUMBER_OF_FALLING_NUMBERS = 0

function generate_x_axis_points(xMax){
  const pointsX=[];
  for(let i=0;i<=xMax;i+=Math.floor(Math.random()*70)+20){
    pointsX.push(i+"px")
  }
  return pointsX
}

//start the numbers falling
export function fallingNumbers(container, game, animations) {
  if (game.isOn) {
    const containerWidth = container.getBoundingClientRect().width
    X_AXIS_POINTS = generate_x_axis_points(containerWidth-40)
    NUMBER_OF_FALLING_NUMBERS=X_AXIS_POINTS.length
    ROUND_INTERVAL=X_AXIS_POINTS.length*INTERVAL_BETWEEN_NUMS+1000
    for (let i = 0; i < NUMBER_OF_FALLING_NUMBERS; i++) {
      setTimeout(() => {
        if (game.isOn) {
          createNumber(container, animations);
        }
      }, INTERVAL_BETWEEN_NUMS * i);
    }
    setTimeout(function () { //Next round
      fallingNumbers(container, game, animations);
    }, ROUND_INTERVAL);
  }
}

//Create a number element and setup its falling animation, add the animation to the active animation array
export function createNumber(container, animations) {
  const elementId = Date.now();
  const xIdx =  Math.floor(Math.random() * X_AXIS_POINTS.length);
  const [x]=X_AXIS_POINTS.splice(xIdx,1)
  const numContainer = document.createElement("div");
  numContainer.id = elementId;
  numContainer.style.zIndex = 1;
  const num = document.createElement("span");
  num.textContent = Math.floor(Math.random() * 10) + 1;
  numContainer.appendChild(num);
  container.appendChild(numContainer);

  const animation = numContainer.animate(
    [
      { transform: "translate3d(" + x + ",0vh,0)" },
      { transform: "translate3d(" + x + ",100vh,0)" },
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
