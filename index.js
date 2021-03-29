const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const process = require("process");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3000;
const api = "https://api.triviabeat.io";

process.on("uncaughtException", function (err) {
  console.error(err && err.stack ? err.stack : err);
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// if log folder exists
if (fs.existsSync("/var/log/triviabeatui")) {
  // redirecting console output to logfiles
  var sout = fs.createWriteStream("/var/log/triviabeatui/console.log", { flags: "a" });
  var serr = fs.createWriteStream("/var/log/triviabeatui/error.log", { flags: "a" });
  process.stdout.write = sout.write.bind(sout);
  process.stderr.write = serr.write.bind(serr);
}

app.use(express.json({ limit: "1mb" }));
app.use(cors());

app.use("/", express.static("public"));
app.use("/lib", express.static("public/lib"));

app.put("/login", (req, res) => {
  axios({
    method: "PUT",
    url: api + "/session",
    timeout: 1000 * 10, // Wait for 10 seconds
    data: {
      email: req.headers.email,
      password: req.headers.password,
    },
  })
    .then((response) => {
      console.log("----- Response Success -----");
      console.log(response.status);
      console.log(response.data);
      console.log("----------------------------");
      res.write(response.data);
    })
    .catch((error) => {
      //this will say if a timeout happened
      console.log(error.code)
      console.log(error.message)
      console.log(error.stack)
      
      console.log("----- Response Failed -----");
      console.log(error.response.status);
      console.log("---------------------------");
      res.write(error.response.status);
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
    origin: "*",
    methods: ["GET", "POST"]
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
