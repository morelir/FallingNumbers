export let nextNumber;

export function createNext() {
  nextNumber = 1;
  const header = document.querySelector("header")
  const next = document.createElement("p");
  const span = document.createElement("span");
  next.innerText = "Next: ";
  next.classList.add("next-number");
  span.innerText = nextNumber;
  next.appendChild(span);
  header.appendChild(next);
}

export function stepNextNumber() {
  nextNumber++;
  const spanNextNumber = document.querySelector("header .next-number span");
  spanNextNumber.innerText = nextNumber;
}
