let roboto;
var inp, inp1;
function Login(){
  inp = createInput("email");
  inp1 = createInput("password");
  radio = createRadio();
  createP('this is some text');
  radio.option("1", "Sign UP")
  radio.option("2", "Login")
  radio.selected("2")
  radio.disable();
  radio.position(40,40)

  submit = createButton("submit")
  submit.mousePressed(sub)
  submit.position(40,100)
  if(radio.value() == "2"){
    inp.position(40, 60)
    inp1.position(40, 80)
    inp.input(myInputEvent);
  }

  function sub(){
    console.log(inp.value() + inp1.value())
    httpDo(
      "/login",
      {
        method: 'PUT',
        // Other Request options, like special headers for apis
        data: {
          email: inp.value(),
          password: inp1.value()
        }
      },
      function(res) {
         console.log(res);
      },
      function(err) {
        console.log(err);
      }
    );
  }
}





function setup() {
  createCanvas(100, 100, WEBGL);
  background(120);
  textFont(roboto);


  //input.position(10, 10, 'absolute')
}
function draw() {}

function myInputEvent() {
  console.log("you are typing: ", this.value());
}
