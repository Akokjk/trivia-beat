function Button(x, y, xSize, ySize, size, texts) {
  this.x = x;
  this.y = y;
  this.col = color(255);
  this.visible = true;
  this.xSize = xSize;
  this.ySize = ySize;
  this.texts = texts;
  this.visible = true;
  this.size = size;
  this.display = function () {
    if (this.visible) {
      textAlign(CENTER, CENTER);
      strokeWeight(1 / gridSize);
      fill(255, 0, 0);
      rectMode(CENTER);
      rect(this.x, this.y, this.xSize, this.ySize);
      fill(0);
      textSize(this.size);
      text(this.texts, this.x, this.y - (size * 5) / 33);
    }
  };
}
