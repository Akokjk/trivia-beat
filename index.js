const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const proc = require("process");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json({ limit: "1mb" }));
const port = 3000;

proc.on("uncaughtException", function (err) {
  console.error(err && err.stack ? err.stack : err);
});

// if log folder exists
if (fs.existsSync("/var/log/triviabeatui")) {
  // redirecting console output to logfiles
  var sout = fs.createWriteStream("/var/log/triviabeatui/node.stdout.log", { flags: "a" });
  var serr = fs.createWriteStream("/var/log/triviabeatui/node.stderr.log", { flags: "a" });
  proc.stdout.write = sout.write.bind(sout);
  proc.stderr.write = serr.write.bind(serr);
}

var corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://play.triviabeat.io",
    "https://api.triviabeat.io"
  ],
  methods: ["GET", "PUT", "POST", "DELETE"],
  optionsSuccessStatus: 204,
  credentials: true,
  preflightContinue: true
};

app.use(cors(corsOptions));

app.use("/", express.static("public"));
app.use("/lib", express.static("public/lib"));

app.put("/login", (req, res) => {
  /*headers: {
    "Content-Type": 'application/json'
  }*/

  var api = "https://api.triviabeat.io/session";
  axios({
    method: "PUT",
    url: api,
    data: {
      email: req.headers.email,
      password: req.headers.password,
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

var server = app.listen(port, "127.0.0.1", () => {
  console.log(`Trivia Beat app listening at port ${port}`);
});

var io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://play.triviabeat.io",
      "https://api.triviabeat.io"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
});

var clients = 0;

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
      io.sockets.emit("mouse", data);

      // This is a way to send to everyone including sender
      // io.sockets.emit('message', "this goes to everyone");
    });
    //socket.on("clients", function(data){
    io.sockets.emit("clients", clients);
    //})
    socket.on("disconnect", function () {
      console.log("Client has disconnected");
      clients--;
      socket.broadcast.emit("clients", clients);
    });
  }
);
