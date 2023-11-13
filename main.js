const canvas = document.querySelector("canvas");
const toolBtn = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fillColor");
const sizeSlider = document.querySelector("#size-slider");
const colorBtn = document.querySelectorAll(".colors ul li");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImage = document.querySelector(".save-image");
const canvasText = canvas.getContext("2d");
// default value
let isDrawing = false;
let brushWidth = 5;
let selectedTool = "brush";
let prevMouseX;
let prevMouseY;
let snapShot;
let selectedColor = "000";

// endHeadingSpan.style.color = selectedColor;
const setCanvasBackground = () => {
  // set image color white
  canvasText.fillStyle = "#fff";
  canvasText.fillRect(0, 0, canvas.width, canvas.height);
  canvasText.fillStyle = selectedColor;
};
window.addEventListener("load", () => {
  //setting canvas width and canvas height and offset return viewable width and height of an element
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  setCanvasBackground();
});
// start creating options
const drawReact = e => {
  // if fillColor isn't checked draw a react with border else draw react with background
  if (!fillColor.checked) {
    // creating circle according to the mouse pointer
    return canvasText.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  canvasText.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};
const drawCircle = e => {
  canvasText.beginPath(); //creating new path to draw circle
  // getting radius for circle according to the mouse pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  canvasText.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //creating circle according to the mouse pointer
  fillColor.checked ? canvasText.fill() : canvasText.stroke(); //if fillColor is checked fill fill circle or draw border circle
};
const drawTriangle = e => {
  canvasText.beginPath(); //creating new path to draw circle
  canvasText.moveTo(prevMouseX, prevMouseY); //creating triangle to the mouse pointer
  canvasText.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
  canvasText.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line of triangle
  canvasText.closePath(); //closing path

  fillColor.checked ? canvasText.fill() : canvasText.stroke(); //if fillColor is checked fill fill triangle or draw border circle
};
//////////////////////////
const startDraw = e => {
  isDrawing = true;
  prevMouseX = e.offsetX; //passing current mouseX position as prevMouseX
  prevMouseY = e.offsetY; //passing current mouseY position as prevMouseY
  canvasText.beginPath(); //making new line in canvas
  canvasText.lineWidth = brushWidth;
  snapShot = canvasText.getImageData(0, 0, canvas.width, canvas.height);
  canvasText.strokeStyle = selectedColor; //passing selectColor as a stroke color
  canvasText.fillStyle = selectedColor; //passing selectColor as a fill color
};
const drawing = e => {
  if (!isDrawing) return; //if isDrawing is false return from hear
  canvasText.putImageData(snapShot, 0, 0); //adding copy canvas date on canvas
  if (selectedTool === "brush" || selectedTool === "eraser") {
    // if select eraser is selected so then est strokeStyle white
    canvasText.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    canvasText.lineTo(e.offsetX, e.offsetY); // creating line to the mouse pointer
    canvasText.stroke(); //drawing /filling line with color
  } else if (selectedTool === "rectangle") {
    drawReact(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};
toolBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});
colorBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".colors ul .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

// btn of clean canvas
clearCanvas.addEventListener("click", () => {
  canvasText.clearRect(0, 0, canvas.width, canvas.height); //clearing canvas
});
//save img
saveImage.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`; //create canvas link
  link.href = canvas.toDataURL(); //create canvas link to href
  link.click(); //click to download img
});
sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value)); //changing size of line
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
