export function createBucket(container) {
  let offset = [0, 0];
  let isDragging = false;
  const containerRect = container.getBoundingClientRect();
  const bucket = document.createElement("div");
  bucket.classList.add("bucket");
  container.appendChild(bucket);

  bucket.addEventListener("mousedown", handleDragStart);
  bucket.addEventListener("touchstart", handleDragStart);

  function handleDragStart(e) {
    e.preventDefault(); // Prevent default behavior for both mouse and touch events
    isDragging = true;
    
    if (e.type === "mousedown") {
      offset = [bucket.offsetLeft - e.clientX, bucket.offsetTop - e.clientY];
    } else if (e.type === "touchstart" && e.touches.length === 1) {
      offset = [
        bucket.offsetLeft - e.touches[0].clientX,
        bucket.offsetTop - e.touches[0].clientY,
      ];
    }

    bucket.style.cursor = "grabbing";

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
    const bucketRect = bucket.getBoundingClientRect();
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
      cursorInHorizontalBoundaries(x, bucketRect) &&
      cursorInVerticalBoundaries(y, bucketRect)
    ) {
      bucket.style.left = x + offset[0] + "px";
      bucket.style.top = y + offset[1] + "px";
    } else {
      if (
        // cursor outside vertical boundaries, and inside horizontal boundaries of the container
        cursorInVerticalBoundaries(y, bucketRect) &&
        !cursorInHorizontalBoundaries(x, bucketRect)
      ) {
        bucket.style.top = y + offset[1] + "px";
      } else if (
        // cursor outside horizontal boundaries, and inside vertical boundaries of the container
        cursorInHorizontalBoundaries(x, bucketRect) &&
        !cursorInVerticalBoundaries(y, bucketRect)
      ) {
        bucket.style.left = x + offset[0] + "px";
      }
    }
  }

  function handleDragEnd() {
    isDragging = false;
    bucket.style.cursor = "grab";

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("touchmove", handleDragMove);

    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchend", handleDragEnd);
  }

  // check if cursor inside vertical boundaries of the container
  function cursorInHorizontalBoundaries(mouseX, bucketRect) {
    return (
      mouseX - (bucket.offsetLeft - offset[0] - bucketRect.left) >=
        containerRect.left &&
      mouseX + (bucketRect.right - bucket.offsetLeft + offset[0]) <=
        containerRect.right
    );
  }

  // check if cursor inside horizontal boundaries of the container
  function cursorInVerticalBoundaries(mouseY, bucketRect) {
    return (
      mouseY - (bucket.offsetTop - offset[1] - bucketRect.top) >=
        containerRect.top &&
      mouseY + (bucketRect.bottom - bucket.offsetTop + offset[1]) <=
        containerRect.bottom
    );
  }

  return bucket;
}
