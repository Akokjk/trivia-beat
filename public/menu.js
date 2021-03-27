function Menu() {
  //params
  this.debug = true;
  this.visible = true;

  this.items = [];
  //                          X,    Y,    XS,   YS,FS, TEXT
  this.items.push(new Button( 0,   -4,    27.75, 8, 2, "Play"));
  this.items.push(new Button(-7.0,  4,    13.75, 7, 1, "Contribute"));
  this.items.push(new Button(-7.0, 11.25, 13.75, 7, 1, "Profile"));
  this.items.push(new Button( 7.0,  4,    13.75, 7, 1, "Store"));
  this.items.push(new Button( 7.0, 11.25, 13.75, 7, 1, "Leaderboard"));
  this.items.push(new Button(12,  -13,     4,    2, 1, "Logout"));

  this.display = function () {
    //draw items
    title(8, -10); //the x value determines the size of the line
    grid();


    for (var i = 0; i < this.items.length; i++) {

      this.items[i].display();
    }
  };
}

function title(x, y) {
  fill(0);
  stroke(0);
  var title = "Trivia Beat";
  textSize(2);
  text(title, 0, y);
  strokeWeight(5 / gridSize);
  line(-x, y + 1.3, x, y + 1.3);
  textSize(1);
  text("Active Users: " + clients, -9, -12)


}
