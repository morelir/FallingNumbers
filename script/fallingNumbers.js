const DURATION = 3000; //Fall animation duration
let ROUND_INTERVAL = 0; //Interval between rounds
// const NUMBER_OF_FALLING_NUMBERS = window.innerWidth > 480 ? 40 : 8; //Number of falling numbers each round
let X_AXIS_POINTS = []
let NUMBER_OF_FALLING_NUMBERS = 0

function generate_x_axis_points(){
  const pointsX=[]
  for(let i=0;i<=98;i+=Math.floor(Math.random()*5)+2){
    pointsX.push(i+"vw")
  }
  return pointsX
}

//start the numbers falling
export function fallingNumbers(container, game, animations) {
  if (game.isOn) {
    X_AXIS_POINTS = generate_x_axis_points()
    NUMBER_OF_FALLING_NUMBERS=X_AXIS_POINTS.length
    ROUND_INTERVAL=X_AXIS_POINTS.length*100+1000
    // console.log(X_AXIS_POINTS.length,ROUND_INTERVAL)
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
  console.log("asd")
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
