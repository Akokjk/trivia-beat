let roboto;


function preload() {
  roboto = loadFont('assets/Roboto-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); //center is in the middle of the screen
  background(255);
  textFont(roboto);
}

function draw() {
  fill(0)
  text("Sign in and up", 0, 0)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}
