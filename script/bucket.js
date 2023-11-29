export function createBucket(container) {
  const containerRect = container.getBoundingClientRect();
  let offset = [0, 0];
  let isDragging = false;
  let draggable = document.createElement("div");
  draggable.classList.add("bucket");
  container.appendChild(draggable);
  
  draggable.addEventListener("mousedown", handleDragStart);
  draggable.addEventListener("touchstart", handleDragStart);

  function handleDragStart(e) {
    e.preventDefault(); // Prevent default behavior for both mouse and touch events
    isDragging = true;
    if (e.type === "mousedown") {
      offset = [
        draggable.offsetLeft - e.clientX,
        draggable.offsetTop - e.clientY,
      ];
    } else if (e.type === "touchstart" && e.touches.length === 1) {
      offset = [
        draggable.offsetLeft - e.touches[0].clientX,
        draggable.offsetTop - e.touches[0].clientY,
      ];
    }

    draggable.style.cursor = "grabbing";

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("touchmove", handleDragMove, {
      passive: false,
    });

    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);
  }

  function handleDragMove(e) {
    if (!isDragging) return;

    e.preventDefault(); // Prevent text selection and other default behaviors
    const draggableRect = draggable.getBoundingClientRect();
    let x, y;
    if (e.type === "mousemove") {
      x = e.clientX;
      y = e.clientY;
    } else if (e.type === "touchmove" && e.touches.length === 1) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }

    if (
      // cursor inside horizontal and vertical boundaries of the container
      cursorInVerticalBoundaries(x, draggableRect) &&
      cursorInHorizontalBoundaries(y, draggableRect)
    ) {
      draggable.style.left = x + offset[0] + "px";
      draggable.style.top = y + offset[1] + "px";
    } else {
      if (
        // cursor outside vertical boundaries, and inside horizontal boundaries of the container
        cursorInHorizontalBoundaries(y, draggableRect) &&
        !cursorInVerticalBoundaries(x, draggableRect)
      ) {
        draggable.style.top = y + offset[1] + "px";
      } else if (
        // cursor outside horizontal boundaries, and inside vertical boundaries of the container
        cursorInVerticalBoundaries(x, draggableRect) &&
        !cursorInHorizontalBoundaries(y, draggableRect)
      ) {
        draggable.style.left = x + offset[0] + "px";
      }
    }
  }

  function handleDragEnd() {
    isDragging = false;
    draggable.style.cursor = "grab";

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("touchmove", handleDragMove);

    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);
  }

  // check if cursor inside vertical boundaries of the container
  function cursorInVerticalBoundaries(mouseX, draggableRect) {
    return (
      mouseX - (draggable.offsetLeft - offset[0] - draggableRect.left) >=
        containerRect.left &&
      mouseX + (draggableRect.right - draggable.offsetLeft + offset[0]) <=
        containerRect.right
    );
  }

  // check if cursor inside horizontal boundaries of the container
  function cursorInHorizontalBoundaries(mouseY, draggableRect) {
    return (
      mouseY - (draggable.offsetTop - offset[1] - draggableRect.top) >=
        containerRect.top &&
      mouseY + (draggableRect.bottom - draggable.offsetTop + offset[1]) <=
        containerRect.bottom
    );
  }
  
  return draggable;
}
