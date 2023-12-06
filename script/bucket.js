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
      // The cursor is inside horizontal and vertical boundaries of the container
      cursorInHorizontalBoundaries(x, bucketRect) &&
      cursorInVerticalBoundaries(y, bucketRect)
    ) {
      bucket.style.left = x + offset[0] + "px";
      bucket.style.top = y + offset[1] + "px";
    } else {
      if (
        // The cursor is inside vertical boundaries , and outside one of horizontal boundaries of the container
        cursorInVerticalBoundaries(y, bucketRect)
      ) {
        bucket.style.left =
          (cursorWithinLeftBoundary(x, bucketRect)
            ? containerRect.width - bucketRect.width
            : 0) + "px";
        bucket.style.top = y + offset[1] + "px";
      } else if (
        // The cursor is inside horizontal boundaries, and outside one of vertical boundaries of the container
        cursorInHorizontalBoundaries(x, bucketRect)
      ) {
        bucket.style.top =
          (cursorWithinTopBoundary(y, bucketRect)
            ? containerRect.height - bucketRect.height
            : 0) + "px";
        bucket.style.left = x + offset[0] + "px";
      } else {
        // The cursor is neither within the horizontal boundaries nor the vertical boundaries of the container.
        bucket.style.left =
          (cursorWithinLeftBoundary(x, bucketRect)
            ? containerRect.width - bucketRect.width
            : 0) + "px";
        bucket.style.top =
          (cursorWithinTopBoundary(y, bucketRect)
            ? containerRect.height - bucketRect.height
            : 0) + "px";
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

  // check if cursor is inside horizontal boundaries of the container
  function cursorInHorizontalBoundaries(mouseX, bucketRect) {
    return (
      cursorWithinLeftBoundary(mouseX, bucketRect) &&
      cursorWithinRightBoundary(mouseX, bucketRect)
    );
  }

  function cursorWithinLeftBoundary(mouseX, bucketRect) {
    return (
      mouseX - (bucket.offsetLeft - offset[0] - bucketRect.left) >=
      containerRect.left
    );
  }

  function cursorWithinRightBoundary(mouseX, bucketRect) {
    return (
      mouseX + (bucketRect.right - bucket.offsetLeft + offset[0]) <=
      containerRect.right
    );
  }

  // check if cursor is inside vertical boundaries of the container
  function cursorInVerticalBoundaries(mouseY, bucketRect) {
    return (
      cursorWithinTopBoundary(mouseY, bucketRect) &&
      cursorWithinBottomBoundary(mouseY, bucketRect)
    );
  }

  function cursorWithinTopBoundary(mouseY, bucketRect) {
    return (
      mouseY - (bucket.offsetTop - offset[1] - bucketRect.top) >=
      containerRect.top
    );
  }

  function cursorWithinBottomBoundary(mouseY, bucketRect) {
    return (
      mouseY + (bucketRect.bottom - bucket.offsetTop + offset[1]) <=
      containerRect.bottom
    );
  }

  return bucket;
}
