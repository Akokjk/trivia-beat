function Game(gridX, gridY) {
  this.GridX = gridX;
  this.GridY = gridY;
  this.text;
  this.centerX = windowWidth / 2;
  this.centerY = windowHeight / 2;
  this.elements = [];
  this.text = loadFont("assets/SourceCodePro-Regular.ttf");
  this.elements.push(new Menu());
  this.canvas;
  var userID;
  var expiration;
  this.setup = function () {
    console.log("game starting");
    this.canvas = createCanvas(windowWidth, windowHeight);
    textFont(this.text);
    background(434);
    this.canvas.mousePressed(() => {
      sound = new Howl({
        src: ["assets/hit.wav"]
      });
      sound.play();
    });
    userID = getItem("userId");
    sessionId = getItem("sessionId");
    expiration = getItem("expiration");
    if (userID || sessionId == null) {
      console.log("unable to find session or user ID");
      this.elements[0].visible = false; //setting the menu to false
      //this.elements.push(new Login());
      Login();
    }
  };

  this.display = function () {
    clear();
    for (var i = 0; i < this.elements.length; i++) {
      translate(this.centerX, this.centerY);
      scale(this.GridX, this.GridY);
      this.elements[i].display();
    }
  };
}

function grid() {
  if (debug) {
    let amount; // the amount of lines that need to be generated
    if (windowWidth > windowHeight) {
      amount = Math.floor(windowWidth / gridSize);
    } else amount = Math.floor(windowHeight / gridSize);

    for (var i = 0; i < amount; i++) {
      fill(0);
      strokeWeight(1 / gridSize);
      textSize(10 / gridSize);
      textAlign(RIGHT, CENTER);
      line(-windowWidth / 2, -i, windowWidth / 2, -i);
      text(-i, 0, -i + 0.1);
      text(i, 0, i + 0.1);
      line(-windowWidth / 2, i, windowWidth / 2, i);
      text(-i, -i, 0.1);
      text(i, i, 0.1);
      line(-i, windowHeight / 2, -i, -windowHeight / 2);
      line(i, windowHeight / 2, i, -windowHeight / 2);
    }
  }
}
