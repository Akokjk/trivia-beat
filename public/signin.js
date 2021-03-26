let roboto;


function preload() {
  roboto = loadFont('assets/Roboto-Regular.ttf');
}

function setup() {
  createCanvas(100, 100, WEBGL);
  background(120);
  textFont(roboto);
  let inp = createInput('');
  inp.input(myInputEvent);
  //input.position(10, 10, 'absolute')
}
function draw(){

}


function myInputEvent() {
  console.log('you are typing: ', this.value());
}
