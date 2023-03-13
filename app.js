let COLOR = "#000000";
let ERASE = false;
let GRID = 32;
let touchscreen = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
// Makes the grid
function makeGrid() {
  const sketchContainer = document.querySelector(".sketch-container");
  sketchContainer.style.gridTemplateColumns = `repeat(${GRID}, 1fr)`;
  sketchContainer.style.gridTemplateRows = `repeat(${GRID}, 1fr)`;

  if (sketchContainer.hasChildNodes()) {
    sketchContainer.replaceChildren();
  }

  for (let x = 0; x < GRID * GRID; x++) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    sketchContainer.appendChild(pixel);
  }

  draw(document.querySelectorAll(".pixel"));
}

makeGrid();

//
// drawing logic
function draw(pixel) {
  mouseDown = false;
  window.addEventListener("mousedown", () => (mouseDown = true));
  window.addEventListener("mouseup", () => (mouseDown = false));

  if (!touchscreen) {
    pixel.forEach((pixel) => {
      pixel.addEventListener(
        "mouseover",
        (e) =>
          mouseDown &&
          (e.target.style.backgroundColor = ERASE ? "#ffffff" : COLOR)
      );

      //
      // to color the grid on first click
      pixel.addEventListener(
        "mousedown",
        (e) => (e.target.style.backgroundColor = ERASE ? "#ffffff" : COLOR)
      );
    });
  } else {
    //
    // drawing logic for mobile
    window.ontouchmove = (e) => {
      let mPixel = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
      if (mPixel.classList[0] === "pixel") {
        mPixel.style.backgroundColor = ERASE ? "#ffffff" : COLOR;
      }
    };
  }
}

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
});

//
// Clear button
const clear = document.getElementById("clear");
clear.addEventListener("click", () => {
  const pixel = document.querySelectorAll(".pixel");
  pixel.forEach((pixel) => {
    pixel.style.backgroundColor = "#ffffff";
  });
});

//
// Sliding bar for the grid size
const gridSlider = document.getElementById("grid-slider");
const gridValue = document.getElementById("grid-value");

if (!touchscreen) {
  gridSlider.oninput = (e) => {
    gridValue.innerHTML = `Grid size: ${e.target.value}x${e.target.value}`;
  };

  gridSlider.onmouseup = (e) => {
    GRID = e.target.value;
    makeGrid();
  };
} else {
  gridSlider.oninput = (e) => {
    gridValue.innerHTML = `Grid size: ${e.target.value}x${e.target.value}`;
  };

  gridSlider.ontouchend = (e) => {
    GRID = e.target.value;
    makeGrid();
  };
}

console.log(
  "ontouchstart" in window,
  navigator.maxTouchPoints > 0,
  navigator.msMaxTouchPoints > 0
);
