const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require('fs');
const proc = require('process');

const app = express();
const port = 3000;
var clients = 0;
// redirecting console output to logfiles
var sout = fs.createWriteStream("/var/log/triviabeatui/node.stdout.log", { flags: "a" });
var serr = fs.createWriteStream("/var/log/triviabeatui/node.stderr.log", { flags: "a" });
//var sout = fs.createWriteStream("node.stdout.log", { flags: "a" });
//var serr = fs.createWriteStream("node.stderr.log", { flags: "a" });
proc.stdout.write = sout.write.bind(sout);
proc.stderr.write = serr.write.bind(serr);

proc.on('uncaughtException', function(err) {
  console.error((err && err.stack) ? err.stack : err);
});

app.use(require("cors")());

app.use("/", express.static("public"));
app.use("/lib", express.static("public/lib"));
// app.get('/', (req, res) => {
//   res.setHeader("")
//    res.sendFile('index.html', {root: __dirname })
// })

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

var server = app.listen(port, "127.0.0.1", () => {
  console.log(`Trivia Beat app listening at port ${port}`);
});

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on(
  "connection",
  // We are given a websocket object in our function
  function (socket) {
    console.log("We have a new client: " + socket.id);
    clients++;
    // When this user emits, client side: socket.emit('otherevent',some data);

    socket.on("mouse", function (data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'mouse' " + data.x + " " + data.y);
      io.sockets.emit('mouse', data);

      // This is a way to send to everyone including sender
      // io.sockets.emit('message', "this goes to everyone");
    });
    //socket.on("clients", function(data){
      io.sockets.emit('clients', clients);
    //})
    socket.on("disconnect", function () {
      console.log("Client has disconnected");
      clients--;
      socket.broadcast.emit("clients", clients);
    });
  }
);
