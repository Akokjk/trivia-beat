//game params
let debug = false;
let gridSize = 32;
let game;
var socket; //used to send and recieve information from index.js in real time
var clients =  0;
var song
function preload() {
  game = new Game(gridSize, gridSize, debug);

}

function setup() {

  socket = io.connect("https://play.triviabeat.io/", {secure: true});
  game.setup();
  socket.on("mouse", function (data) {
    console.log("Got: " + data.x + " " + data.y + " Clients: " + data.clients);

  });
  socket.on("clients", function (data) {
    clients = data
  });
}


function getAccountName() {
  //get this from API lil' bitch boi!
  return "sure";
}

function getAccountInformation() {
  //get [hearts, gems, account balance]
  return [0, 0, 0.0];
}

function draw() {

  game.display();
}

function yes() {
  console.log("no");
}

function mousePressed() {
  //console.log("Mouse X, Y " + (mouseX-windowWidth/2) + ", "+ (mouseY-windowHeight/2));
  // Draw some white circles
  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 20, 20);
  // Send the mouse coordinates
  sendmouse(mouseX, mouseY);
}

function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);

  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos,
  };

  // Send that object to the socket
  socket.emit("mouse", data);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  game.centerX = windowWidth / 2;
  game.centerY = windowHeight / 2;
}

function keyPressed() {
  if (keyCode === DELETE) {
    if (debug) {
      debug = false;
    } else debug = true;
    console.log("Debug: " + debug);
  }
}
