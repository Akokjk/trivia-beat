const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const process = require("process");
const cors = require("cors");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
const port = 3000;
const api = "https://api.triviabeat.io";

const algorithm = "aes-256-ctr";
const secretKey = "w4A0gFdUr3tG0VtHDHJhaVFm2pTMwV1b";
const iv = crypto.randomBytes(16);

process.on("uncaughtException", function (err) {
  console.error(err && err.stack ? err.stack : err);
});

var production = false;

// if log folder exists
if (fs.existsSync("/var/log/triviabeatui")) {
  // redirecting console output to logfiles
  var sout = fs.createWriteStream("/var/log/triviabeatui/console.log", { flags: "a" });
  var serr = fs.createWriteStream("/var/log/triviabeatui/error.log", { flags: "a" });
  process.stdout.write = sout.write.bind(sout);
  process.stderr.write = serr.write.bind(serr);
  production = true;
}

if (production)
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);
  return decrpyted.toString();
};

app.use(express.json({ limit: "1mb" }));
var corsOptions = {
  origin: "*",
  "Access-Control-Allow-Origin": "*",
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.use("/", express.static("public"));
app.use("/lib", express.static("public/lib"));

app.get("/login", (req, res, next) => {
  res.sendFile("public/login.html", { root: __dirname });
});
app.put("/login", cors(), (req, res, next) => {
  var reqBody = {
    email: req.headers.email,
    password: req.headers.password,
  };
  JSON.stringify(reqBody);
  var exit;
  axios.put(api + "/session", reqBody, {
      timeout: 5000,
      json: true,
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response) {
        if (JSON.stringify(response.data) !== void(0)) {
          const hash = encrypt(JSON.stringify(response.data));
          res.json(hash);
          res.end();
        } else {
          res.end();
        }
      }
    ).catch(function (error) {
      // if (error.response) {
      //    console.log(error.response.data);
      //    console.log(error.response.status);
      //    console.log(error.response.headers);
      //  } else {
      //    // Something happened in setting up the request that triggered an Error
      //    console.log('Error', error.message);
      //  }
      res.end();
    });

});

app.put("/verify", cors(), (req, res, next) => {
  //console.log(req.headers.data);
  if(req.headers.data) {
    var result = decrypt(JSON.parse(req.headers.data));
    //console.log(result);
    var date = new Date();
    if (result.expiration < date.getTime()) {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
  res.end();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

var server = app.listen(port, () => {
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
    socket.broadcast.emit("player", clients);
    socket.on("player", function (data) {
      // Data comes in as whatever was sent, including objects
      io.sockets.emit("player", clients);
    });
    //socket.on("clients", function(data){
    //io.sockets.emit("clients", clients);
    //})
    socket.on("disconnect", function () {
      console.log("Client has disconnected");
      clients--;
      socket.broadcast.emit("clients", clients);
    });
  }
);
