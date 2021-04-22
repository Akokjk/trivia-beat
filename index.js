const express = require("express");
const fs = require("fs");
const mongodb = require("mongodb");
const mongoose = require('mongoose');
const User = require("./user.js")
const Ip = require("./ip.js")
const encrypt = require("./encrypt.js").encrypt
const decrypt = require("./encrypt.js").decrypt
const sts = require('strict-transport-security');
const https = require("https");
var helmet = require('helmet');

var KEY_FILE = fs.readFileSync("server.key");
var CERT_FILE = fs.readFileSync("www_triviabeat_dev.crt");
var INT_CERT_FILE = fs.readFileSync("www_triviabeat_dev.ca-bundle");
var DH = fs.readFileSync("server.pem");

const app = express();
//app.use(helment());

const port = 443;

var ONE_YEAR = 31536000000;
app.use(helmet.hsts({
    maxAge: ONE_YEAR,
    includeSubDomains: true,
    force: true
}));
//database



const code = "ml9RkDGd4ctjmHTX"; //password
mongoose.connect('mongodb+srv://server:ml9RkDGd4ctjmHTX@cluster0.mlf9x.mongodb.net/triviabeat?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});


const globalSTS = sts.getSTS({'max-age':{'days': 30}});

app.use(globalSTS);
app.use(express.json({ limit: "1mb" }));

app.use("/lib", express.static("public/lib"));
app.use("/styles", express.static("public/styles"));
app.get("/", (req, res) =>{
  return res.status(400).redirect('/test');
})
app.get("/:file", (req, res) =>{
  if(req.params.file == "login"){
    return res.status(400).redirect('/test');
  }
  else{
    Ip.findOne({ip: req.connection.remoteAddress}, '_id', function(err, result){
      if(!result){
        return res.status(200).sendFile("public/test.html", { root: __dirname })
      }
      res.status(200).sendFile("public/"+req.params.file+".html", { root: __dirname }, (err) =>{
        if(err) return res.status(404).sendFile("public/404.html", { root: __dirname })
      });
    });
  }
})

function check(req, res){
  return new Promise(resolve => {
    setTimeout(() => {
      Ip.findOne({ip: req}, '_id', function(err, result){
        if(!result) return res.status(403).send("Not Authorized")
      });
    }, 2000);
  });

}


app.put("/login" , async (req, res) => {
  await check(req.connection.remoteAddress, res);
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
      ip: req.connection.remoteAddress,
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

app.put("/verify", async (req, res) => {
  //console.log(req.headers.data);
  await check(req.connection.remoteAddress, res);
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

app.put("/username", (req, res) => {
  User.findOne({name: req.headers.username}, '_id', function(err, result){
    if(!result) return res.status(200).send(err || true);
    else return res.status(200).send(false);
  });
});



var server = https.createServer({
  key: KEY_FILE,
  cert: CERT_FILE,
  ca: INT_CERT_FILE,
  ciphers: [
    "ECDHE-RSA-AES256-SHA384",
    "DHE-RSA-AES256-SHA384",
    "ECDHE-RSA-AES256-SHA256",
    "DHE-RSA-AES256-SHA256",
    "ECDHE-RSA-AES128-SHA256",
    "DHE-RSA-AES128-SHA256",
    "HIGH",
    "!aNULL",
    "!eNULL",
    "!EXPORT",
    "!DES",
    "!RC4",
    "!MD5",
    "!PSK",
    "!SRP",
    "!CAMELLIA"
  ].join(':'),
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
