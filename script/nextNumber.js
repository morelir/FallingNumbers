export let nextNumber;
const numberContainer = document.querySelector("header .next-number");
const numberText = document.querySelector("header .next-number span");

export function createNext() {
  nextNumber = 1;
  numberContainer.classList.remove("hide-display")
  numberText.textContent=nextNumber;
}

export function stepNextNumber() {
  nextNumber++;
  numberText.textContent=nextNumber;
}
