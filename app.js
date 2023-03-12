let COLOR = "#0008ff";
let ERASE = false;

// Makes the grid
const sketchContainer = document.querySelector(".sketch-container");
for (let x = 0; x < 256; x++) {
  const pixel = document.createElement("div");
  pixel.classList.add("pixel");
  sketchContainer.appendChild(pixel);
}

//
// drawing logic
const pixel = document.querySelectorAll(".pixel");

mouseDown = false;
window.onmousedown = () => (mouseDown = true);
window.ontouchstart = () => (mouseDown = true);

window.onmouseup = () => (mouseDown = false);
window.ontouchend = () => (mouseDown = false);
console.log(window.ontouchstart);

pixel.forEach((pixel) => {
  pixel.addEventListener(
    "mouseover",
    () => mouseDown && (pixel.style.backgroundColor = ERASE ? "#ffffff" : COLOR)
  );
  pixel.addEventListener(
    "ontouchmove",
    () => mouseDown && (pixel.style.backgroundColor = ERASE ? "#ffffff" : COLOR)
  );

  //
  // to color the grid on first click
  pixel.addEventListener(
    "mousedown",
    () => (pixel.style.backgroundColor = ERASE ? "#ffffff" : COLOR)
  );
  pixel.addEventListener(
    "touchstart",
    () => (pixel.style.backgroundColor = ERASE ? "#ffffff" : COLOR)
  );
});

//
// Pick new color
function setColor(pickedColor) {
  COLOR = pickedColor;
}
const colorPicker = document.getElementById("color-picker");
colorPicker.oninput = (e) => setColor(e.target.value);

//
// Erase button
const eraser = document.getElementById("eraser");
eraser.addEventListener("click", () => {
  eraser.classList.toggle("btn-on");
  ERASE ? (ERASE = false) : (ERASE = true);
  console.log(ERASE);
});
