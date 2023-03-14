let COLOR = "#000000";
let ERASE = false;
// 1 is grayscale, 2 is lighten
let COLORMODE = ["off", "grayscale", "lighten"];
let CURRENTMODE = 0; // current coloring mode
let GRID = 32;
let touchscreen = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;

// Makes the grid
function makeGrid() {
  const sketchContainer = document.querySelector(".sketch");
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
      pixel.addEventListener("mouseover", (e) => {
        if (ERASE && mouseDown) {
          eraseMode(e.target);
        } else if (COLORMODE[CURRENTMODE] === "grayscale" && mouseDown) {
          grayscaleMode(e.target);
        } else if (COLORMODE[CURRENTMODE] === "lighten" && mouseDown) {
          ligthenMode(e.target);
        } else if (mouseDown) {
          normalDraw(e.target);
        }
      });

      //
      // to color the grid on first click
      pixel.addEventListener("mousedown", (e) => {
        if (ERASE) {
          eraseMode(e.target);
        } else if (COLORMODE[CURRENTMODE] === "grayscale") {
          grayscaleMode(e.target);
        } else if (COLORMODE[CURRENTMODE] === "lighten") {
          ligthenMode(e.target);
        } else {
          normalDraw(e.target);
        }
      });
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
        if (ERASE) {
          eraseMode(mPixel);
        } else if (GRAYSCALE) {
          grayscaleMode(mPixel);
        } else if (LIGHTEN) {
          ligthenMode(mPixel);
        } else {
          normalDraw(mPixel);
        }
      }
    };

    //
    // to color the grid on first click
    window.ontouchstart = (e) => {
      let mPixel = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
      if (mPixel.classList[0] === "pixel") {
        if (ERASE) {
          eraseMode(mPixel);
        } else if (GRAYSCALE) {
          grayscaleMode(mPixel);
        } else if (LIGHTEN) {
          ligthenMode(mPixel);
        } else {
          normalDraw(mPixel);
        }
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
eraser.addEventListener("click", (e) => {
  e.target.classList.toggle("btn-on");
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

// COLOR MODES
//
// Grayscale button - 1
const grayscaler = document.getElementById("grayscale");
grayscaler.addEventListener("click", (e) => {
  if (COLORMODE[CURRENTMODE] === "grayscale") {
    CURRENTMODE = 0;
  } else {
    CURRENTMODE = 1;
  }
  toggleButton();
});

//
// lighten button - 2
const lighten = document.getElementById("lighten");
lighten.addEventListener("click", (e) => {
  if (COLORMODE[CURRENTMODE] === "lighten") {
    CURRENTMODE = 0;
  } else {
    CURRENTMODE = 2;
  }
  toggleButton();
});

// Turns off other color mode when one is activated
function toggleButton() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((b) => {
    if (COLORMODE[CURRENTMODE] === b.getAttribute("id")) {
      b.classList.add("btn-on");
    } else {
      b.classList.remove("btn-on");
    }
  });
}

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

//
// normal drawing mode
function normalDraw(e) {
  e.style.backgroundColor = COLOR;
}

// erase mode
function eraseMode(e) {
  if (e.style.backgroundColor !== undefined) {
    e.style.backgroundColor = "#ffffff";
  }
}

// grayscale mode
function grayscaleMode(e) {
  // element doesnt initially have backgroundcolor propert even when I set it
  // so i have to resort to this mess, kill me
  if (e.style.backgroundColor !== undefined && e.style.backgroundColor !== "") {
    let color = e.style.backgroundColor;
    let regex = color.replace(/[^,0-9]/g, "").split(",");
    let rgb = regex.map((c) => {
      return parseInt(c);
    });

    let r = rgb[0] - 25.5;
    let g = rgb[1] - 25.5;
    let b = rgb[2] - 25.5;

    e.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  } else {
    e.style.backgroundColor = "rgb(229.5,229.5,229.5)";
  }
}

// ligthen mode
function ligthenMode(e) {
  if (e.style.backgroundColor !== undefined && e.style.backgroundColor !== "") {
    let color = e.style.backgroundColor;
    let regex = color.replace(/[^,0-9]/g, "").split(",");
    let rgb = regex.map((c) => {
      return parseInt(c);
    });

    let r = rgb[0] + 25.5;
    let g = rgb[1] + 25.5;
    let b = rgb[2] + 25.5;

    e.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }
}
