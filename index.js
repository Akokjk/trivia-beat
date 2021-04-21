const express = require("express");
const fs = require("fs");
const mongodb = require("mongodb");
const mongoose = require('mongoose');
const User = require("./user.js")
const encrypt = require("./encrypt.js").encrypt
const decrypt = require("./encrypt.js").decrypt
const sts = require('strict-transport-security');
const https = require("https");

var KEY_FILE = fs.readFileSync("server.key");
var CERT_FILE = fs.readFileSync("www_triviabeat_dev.crt");
var INT_CERT_FILE = fs.readFileSync("www_triviabeat_dev.ca-bundle");
var DH = fs.readFileSync("server.pem");

const app = express();
//app.use(helment());
var _server_https = null;
const port = 8443;


//database



const code = "ml9RkDGd4ctjmHTX"; //password
mongoose.connect('mongodb+srv://server:ml9RkDGd4ctjmHTX@cluster0.mlf9x.mongodb.net/triviabeat?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});


const globalSTS = sts.getSTS({'max-age':{'days': 30}});

app.use(globalSTS);
app.use(express.json({ limit: "1mb" }));

app.use("/", express.static("public"));
app.use("/lib", express.static("public/lib"));

app.get("/:file", (req, res) =>{
  res.status(200).sendFile("public/"+req.params.file+".html", { root: __dirname }, (err) =>{
    if(err) return res.status(404).sendFile("public/404.html", { root: __dirname })
  });
})


app.put("/login", (req, res) => {

  User.findOne({email: req.headers.email}, '_id expire password', function(err, result){
    if(!result) return res.status(400).send(err || "Cannot find user");
    if(result.password == req.headers.password){
      return res.status(200).send(encrypt(JSON.stringify(result._id)));
    }
    else return res.status(403).send("Password Incorrect")
  });
});

app.put("/register", (req, res) => {
  var tele = req.headers.phone;
  if (tele.charAt(0) !== '+') {
    tele = "+" + tele;
  }
  var formatted = "";
  for (var i = 0; i < tele.length; i++) {
    if (tele.charAt(i) !== ' ' && tele.charAt(i) !== '-') {
      formatted += tele.charAt(i);
    }
  }
  const date = new Date();
  date.setDate(date.getDate() + 30);
  const reqBody = new User({
      email:  req.headers.email,
      password: req.headers.password,
      name: req.headers.name,
      phone: formatted,
      expire: date,
      diamonds: 0,
      hearts: 10,
      bitcoin: 0
    });
      reqBody.save().then(() =>{
         console.log(JSON.stringify(reqBody._id + " " + reqBody.expire))
         return res.status(200).send(encrypt(JSON.stringify(reqBody._id)))
       }).catch(function(error){
         return res.status(400).send(error);
       });
});

app.put("/verify", (req, res) => {
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

var server = https.createServer({
    key: KEY_FILE,
    cert: CERT_FILE,
}, app);
server.listen(port, ()=>{
  console.log("started on port "+port)
});

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

var clients = 0;
io.sockets.on("connection",
  function (socket) {
    console.log("We have a new client: " + socket.id);
    clients++;
    socket.on("player", function (data) {
      // Data comes in as whatever was sent, including objects
      io.sockets.emit("player", clients);
    });
    socket.on("disconnect", function () {
      console.log("Client has disconnected");
      clients--;
      socket.broadcast.emit("clients", clients);
    });
  }
);
