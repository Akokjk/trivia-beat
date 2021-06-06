const express = require("express");
const fs = require("fs");


const encrypt = require("./encrypt.js").encrypt
const decrypt = require("./encrypt.js").decrypt
const secret = require("./encrypt.js").secretKey
const sts = require('strict-transport-security');
const http = require("http");
var helmet = require('helmet');
const db = require('./db')
const { v4: uuidv4 } = require('uuid');
const format = require('pg-format');



var cookieParser = require('cookie-parser');
var cors = require('cors')


const app = express();
//app.use(helmet());

app.use(cors({
  "Cross-Origin-Embedder-Policy": 'require-corp',
 'Cross-Origin-Opener-Policy': 'same-origin',
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "optionsSuccessStatus": 204
}))
app.use(cookieParser())

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




const globalSTS = sts.getSTS({'max-age':{'days': 30}});

app.use(globalSTS);
app.use(express.json({ limit: "1mb" }));
app.use("/", express.static("public/old"));
app.use("/static", express.static("public/react/build/static"));

app.get("/", (req, res) =>{
  console.log(req.cookies)

  //var session = res.cookies.login
  db.query(format("select id from player where session_id = '%s'", req.cookies.login), (err,result) =>{
    if(result.rowCount == 1) return res.sendFile("public/react/build/index.html", { root: __dirname })
    else return res.sendFile("public/old/login.html" , { root: __dirname })
  })


})

app.get("/:file", (req, res) =>{
  if(req.params.file == "tos") return res.sendFile("public/old/tos.html", { root: __dirname })
  return res.redirect("/");
})





app.put("/login" , (req, res) => {
  //params needed: email, password
  var date = new Date();
  db.query(format("select id from player where email = '%s' AND password = '%s' limit 1", req.headers.email, req.headers.password), (err, result) =>{
      const session = uuidv4();
      //need to the uuid to the player now that they have logged in
      if(result.rowCount == 1) {
        db.query(format("update player set session_id = '%s' where id = '%s'", session, result.rows[0].id ), (err1, result1) =>{
          res.cookie('login', session, {
            maxAge: (60*60*24*30),
            httpOnly: true,
            secure: false
           })
          //console.log(result.rows[0].id);
          res.status(200).send(err || result.rowCount == 1 ? true: false);
          //res.status(303).re
        })
      }
  })
});

app.put("/register", (req, res) => {
  //params needed username, email, password
  const session = uuidv4();
  db.query(format("insert into player (username, email, password, session_id) values ('%s', '%s', '%s', '%s')", req.headers.username, req.headers.email, req.headers.password, session), (err, result)=>{
    console.log(err || result)
    res.cookie('login', session, {
      maxAge: (60*60*24*30),
      httpOnly: true,
      secure: false
     })
    res.status(200).redirect('/')
  })

});


app.put("/username", (req, res) => { //check username
  //params needed, username
  db.query(format("select username from player where username = '%s' limit 1", req.headers.username), (err, result) =>{
    //console.log(err || result);
    return res.status(200).send(err || result.rowCount == 0 ? true: false);
  })
});

app.put("/email", (req, res) => {
  db.query(format("select email from player where email = '%s' limit 1", req.headers.email), (err, result) =>{
    //console.log(err || result);
    return res.status(200).send(err || result.rows == 0 ? true: false);
  })
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
});

app.put("/cq", (req, res) => { //check question
  //params needed is the question
  //not verified, not the author, not verified by 10 users, limit to amount

  db.query(format("select title from questions where title like '%s' and verified <> true limit 1", ("%"+req.headers.title+"%")), (err, result) =>{
    console.log(err || result);
    return res.status(200).send(result.rows|| "nothing much wow" || err);
  })
});



app.put("/mq", (req, res) => {

});


app.put("/info", (req, res) =>{
  db.query(format("select gems, hearts, wei from player where session_id = '%s' limit 1", req.headers.login), (err, result) =>{
    return res.status(200).send(result.rows);
  })
})



var server = http.createServer(app);

server.listen(port, ()=>{
  console.log("started on port "+port)
});
