const express = require("express");
const fs = require("fs");
const mongodb = require("mongodb");
const mongoose = require('mongoose');
const User = require("./user.js")
const Ip = require("./ip.js")
const Question = require('./question.js')
const encrypt = require("./encrypt.js").encrypt
const decrypt = require("./encrypt.js").decrypt
const secret = require("./encrypt.js").secretKey
const sts = require('strict-transport-security');
const https = require("https");
const http = require("http");
var helmet = require('helmet');
const db = require('./db')
var format = require('pg-format');



var cookieParser = require('cookie-parser');
var cors = require('cors')
var KEY_FILE = fs.readFileSync("server.key");
var CERT_FILE = fs.readFileSync("www_triviabeat_dev.crt");
var INT_CERT_FILE = fs.readFileSync("www_triviabeat_dev.ca-bundle");
var DH = fs.readFileSync("server.pem");

const app = express();
//app.use(helmet());

app.use(cors({
  "Cross-Origin-Embedder-Policy": 'require-corp',
 'Cross-Origin-Opener-Policy': 'same-origin',
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "optionsSuccessStatus": 204
}))
app.use(cookieParser("w3A0xFdUg3tG6VtHDHJhaVFm2pTMwF2c"))

function IsAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        next(new Error(401));
    }
}



const port = 8080;

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
app.use("/", express.static("public/react/build"));

app.get("/question", (req, res) => {
  res.header({
    'Cross-Origin-Embedder-Policy': 'require-corp',
	  'Cross-Origin-Opener-Policy': 'same-origin',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Header': '*',
  })
  return res.status(200).send({
    question: "What do you want?",
    options: ["apples", "money", "gold", "happiness"],
    answer: 1
  })
})
app.get("/:file", (req, res) =>{

  var today =new Date()
  console.log("signed cookies: " + JSON.stringify(req.signedCookies))
  if(req.signedCookies.login == undefined) return res.status(200).sendFile("public/old/login.html", { root: __dirname });
  User.findOne({_id: req.signedCookies.login}, '_id', function(err, result){
    if(!result)  res.status(200).sendFile("public/old/login.html", { root: __dirname });
    else{
      res.status(200).sendFile("public/"+req.params.file+".html", { root: __dirname }, (err) =>{
        if(err) return res.status(404).sendFile("public/old/404.html", { root: __dirname })
      });
    }
  });
})




app.put("/login" , (req, res) => {
  var date = new Date();
  date.setDate(date.getDate() + 30);
  User.findOne({email:  decrypt(JSON.stringify(req.headers.email))}, '_id password', function(err, result){
    if(!result) return res.status(401).send(err || "Cannot find user");
    if(result.password == decrypt(JSON.stringify(req.headers.password))){
      res.cookie("login", encrypt(JSON.stringify(result._id)),
      {signed: true, httpOnly: true, secure: true, sameSite: true, expires: date, overwrite: true})
      return res.status(200).send("success");
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
      email:  encrypt(req.headers.email),
      password: encrypt(req.headers.password),
      name: encrypt(req.headers.name),
      ip: req.connection.remoteAddress,
      expire: date.valueOf(),
      diamonds: 0,
      hearts: 10,
      bitcoin: 0
    });
    reqBody.save().then(() =>{
       console.log(JSON.stringify(reqBody._id + " " + reqBody.expire))
       return res.status(200).cookie('login', res._id, {signed: true}).send("success")
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

app.put("/email", (req, res) => {
  User.findOne({email: req.headers.email}, '_id', function(err, result){
    if(!result) return res.status(200).send(err || true);
    else return res.status(200).send(false);
  });
});


app.put("/uq", (req, res) => { //unverifiedquestions
  //params needed, userid, amount
  //not verified, not the author, not verified by 10 users, limit to amount
  //var params = [req.headers.userid, req.headers.amount]
  //console.log(params);
  db.query(format("select title, options, answer from questions where id != %s and verified <> true limit %s", req.headers.userid, req.headers.amount), (err, result) =>{
    //console.log(err || result);
    return res.status(200).send(result.rows || "nothing much wow" || err);
  })

  //mongodb way of this bullshit
  // var find = Question.find({verified: false, author: {$ne: req.headers.userid}}, //nverifiers: {$lt: 10}},
  //   "title options answer").limit(parseInt(req.headers.amount));
  //   find.exec(function(err, result){
  //     //  console.log(result)
  //     return res.status(200).send(result || "nothing much wow" || err);
  //   })
});

app.put("/mq", (req, res) => {
  const date = new Date();
  var options = req.headers.options
  var cat = req.headers.category
  var src = req.headers.sources
  const reqBody = new Question({
      title: req.headers.title,
      options: options.split(','),
      answer: req.headers.answer,
      author: req.headers.author,    //should grab from cookie holding encrypted user id
      category: cat.split(','),
      difficulty: req.headers.difficulty,
      verified: false,
      sources: src.split(','),
      reports: 0,
      nverifiers: 0,
      date: date,
    });
    reqBody.save().then(() =>{
       console.log(JSON.stringify("Added  new question: " + reqBody.title))
       return res.status(200).send("success")
     }).catch(function(error){
       return res.status(400).send(error);
     });
});


var server1 = http.createServer(app);
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
server1.listen(port, ()=>{
  console.log("started on port "+port)
});
//
// var io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });
//
// var clients = 0;
// io.sockets.on("connection",
//   function (socket) {
//     console.log("We have a new client: " + socket.id);
//     clients++;
//     socket.on("player", function (data) {
//       // Data comes in as whatever was sent, including objects
//       io.sockets.emit("player", clients);
//     });
//     socket.on("disconnect", function () {
//       console.log("Client has disconnected");
//       clients--;
//       socket.broadcast.emit("clients", clients);
//     });
//   }
// );
