let roboto;
let h_unit;
let w_unit;
let userID;
let sessionId;
let expiration;
let debug = true;
let fillc = (255, 255, 255);

function preload() {
  roboto = loadFont("assets/Roboto-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); //origin is in the middle of the screen
  background(255);
  textFont(roboto);
  textSize(windowWidth / 3);
  textAlign(CENTER, CENTER);
  h_unit = 32; //creates 20 unique spots for text to exist
  w_unit = 32;
  userID = getItem("userId");
  sessionId = getItem("sessionId");
  expiration = getItem("expiration");
  if (userID || sessionId == null) {
    console.log("unable to find session or user ID");
  }
}

function getAccountName() {
  //get this from API lil' bitch boi!
  return "Lil' Bitch Boi";
}

function getAccountInformation() {
  //get [hearts, gems, account balance]
  return [0, 0, 0.0];
}

function draw() {
  clear();
  textAlign(CENTER, CENTER);
  let c = color(0, 0, 0, 150);
  stroke(c);

  if (debug) {
    strokeWeight(1.5);
    //debug grid lines
    var numOfLines = 50;

    for (var i = 0; i < numOfLines; i++) {
      //horizontal lines
      line(
        0 - w_unit * numOfLines,
        h_unit * i,
        -1,
        windowWidth,
        h_unit * i,
        -1
      );
      line(
        0 - w_unit * numOfLines,
        -h_unit * i,
        -1,
        windowWidth,
        -h_unit * i,
        -1
      );
      //vertical lines
      line(w_unit * i, -h_unit * numOfLines, -1, w_unit * i, windowHeight, -1);
      line(
        -w_unit * i,
        -h_unit * numOfLines,
        -1,
        -w_unit * i,
        windowHeight,
        -1
      );
    }
  }

  //background boxx
  fill(255);
  strokeWeight(2);
  rect(-4.5 * w_unit * 2, -6 * h_unit * 2, 9 * w_unit * 2, 12 * h_unit * 2);

  //title
  fill(0);
  stroke(0);
  var title = "Trivia Beat";
  textSize(h_unit * 2);
  text(title, 0, -(h_unit * 8));
  strokeWeight(5);
  line(w_unit * 6, -(h_unit * 6.8), 0, -(h_unit * 6.8));
  line(-w_unit * 6, -(h_unit * 6.8), 0, -(h_unit * 6.8));

  //play button
  fill(255);
  strokeWeight(2);
  size = h_unit * 4.8;
  rect(0 - size / 2, -(h_unit * 6), size, h_unit, 40);
  fill(0);
  textSize(h_unit * 0.8);
  text("Play", 0, -(h_unit * 5.6));

  //Leaderboard
  fill(255);
  stroke(0);
  rect(0 - size / 2, h_unit * 2, size, h_unit, 40);
  textSize(h_unit * 0.8);
  fill(0);
  text("Leaderboard", 0, h_unit * 2.4);

  //Contribute
  fill(255);
  stroke(0);
  rect(0 - size / 2, -(h_unit * 4), size, h_unit, 40);
  textSize(h_unit * 0.8);
  fill(0);
  text("Contribute", 0, -(h_unit * 3.6));

  //Account
  fill(255);
  stroke(0);
  rect(0 - size / 2, -(h_unit * 2), size, h_unit, 40);
  textSize(h_unit * 0.8);
  fill(0);
  text("Profile", 0, -(h_unit * 1.6));

  //Store
  fill(255);
  stroke(0);
  rect(0 - size / 2, -(h_unit * 0), size, h_unit, 40);
  textSize(h_unit * 0.8);
  fill(0);
  text("Store", 0, h_unit * 0.4);

  //dev info

  //ad Banner
  textAlign(CENTER);
  strokeWeight(0);
  fill(255, 0, 0);
  rect(-w_unit * 9, h_unit * 10, w_unit * 18, h_unit * 2);
  fill(255);
  textSize(h_unit * 1.8);
  text("AD BANNER", 0, h_unit * 10.8);

  //login button
  //check for login token
  //if logged in

  if (userID || sessionId == null) {
    textAlign(CENTER, CENTER);
    textSize(w_unit * 0.5);
    strokeWeight(2);
    fill(fillc);
    rect(-w_unit * 8, -h_unit * 10, w_unit * 4, h_unit * 1);
    fill(0);
    text("Sign In / Register", 0 - w_unit * 6, -h_unit * 9.5);
  } else {
    textSize(h_unit / 2);
    textAlign(LEFT);
    point(0 - w_unit * 9.5, -h_unit * 9.5);

    text("Logged in as " + getAccountName(), 0 - w_unit * 8.5, -h_unit * 9.5);

    //Account Information
    //let info = getAccountInformation();
    // textAlign(CENTER)
    // text(info[0]+" Hearts" + "\t\t\t"+ info[1]+" Gems" + "\t\t\t"  + "$" +info[2], 0, h_unit*7.5)
    // fill(255);

    //Log Out button
    // strokeWeight(4);
    // textAlign(CENTER, CENTER);
    // rect(w_unit*5, -h_unit*10, w_unit*3, h_unit, 100);
    // fill(0)
    // text("Log Out", w_unit*6.5, -h_unit*9.6)

    let info = getAccountInformation();
    //Hearts
    textSize(h_unit);
    fill(255, 0, 0);
    rect(-w_unit * 9, -h_unit * 12, (w_unit * 18) / 3, h_unit * 2);
    fill(255);
    text(info[0] + " Hearts", -w_unit * 6, -h_unit * 11);

    //Gems
    fill(0, 0, 255);
    rect((-w_unit / 3) * 9, -h_unit * 12, (w_unit * 18) / 3, h_unit * 2);
    fill(255);
    text(info[1] + " Gems", 0, -h_unit * 11);

    //Cash
    fill(0, 255, 0);
    rect(w_unit * 3, -h_unit * 12, (w_unit * 18) / 3, h_unit * 2);
    fill(255);
    text("$ " + info[2], w_unit * 6, -h_unit * 11);
  }
  //Footer
  textSize(w_unit * 0.5);
  textAlign(LEFT, BOTTOM);
  fill(0);
  text("V 1.00 Aaron Barack", -w_unit * 8.5, h_unit * 10);
}

function mousePressed() {
  truex = mouseX - windowWidth / 2;
  truey = mouseY - windowHeight / 2;
  if (
    truex >= -w_unit * 8 &&
    truex <= -w_unit * 4 &&
    truey >= h_unit * -10 &&
    truey <= h_unit * -9
  ) {
    fillc = [255, 0, 0];
    console.log("YES");
    window.open("/signin", "_self");
  } else {
    fillc = 255;
  }
  //console.log("Mouse X, Y " + (mouseX-windowWidth/2) + ", "+ (mouseY-windowHeight/2));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
