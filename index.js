const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const mongodb = require("mongodb");
const mongoose = require('mongoose');
const User = require("./user.js")
const cors = require("cors")

//database
const code = "ml9RkDGd4ctjmHTX"; //password

mongoose.connect('mongodb+srv://server:ml9RkDGd4ctjmHTX@cluster0.mlf9x.mongodb.net/triviabeat?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
const Cat = mongoose.model('Cat', { name: String });

var corsOptions = {
    origin: '*',
    'Access-Control-Allow-Origin': '*',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET, PUT"
}




const app = express();
const port = process.env.PORT || 5000;


const algorithm = "aes-256-ctr";
const secretKey = "w4A0gFdUr3tG0VtHDHJhaVFm2pTMwV1b";
const iv = crypto.randomBytes(16);


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

app.use(cors(corsOptions));

app.use("/", express.static("public"));
app.use("/lib", express.static("public/lib"));

app.get("/login", (req, res) => {
  res.sendFile("public/login.html", { root: __dirname });
});

app.get("/contribute", (req, res) => {
  res.sendFile("public/contribute.html", { root: __dirname });
});

app.put("/login", (req, res) => {
  var reqBody = {
    email: req.headers.email,
    password: req.headers.password,
  };

  console.log(JSON.stringify(reqBody));

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
        }
        res.end();
      }
    ).catch(function (error) {
      if (error.response) {
         console.log(error.response.data);
         console.log(error.response.status);
         console.log(error.response.headers);
       } else {
         // Something happened in setting up the request that triggered an Error
         console.log('Error', error.message);
       }
       res.end();
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

  const reqBody = new User({
      email:  req.headers.email,
      password: req.headers.password,
      name: req.headers.name,
      phone: formatted,
      dimonds: 0,
      hearts: 10,
      bitcoin: 0
    });
    // User.find({ name: req.headers.name, email: req.headers.email, phone: formatted}, function(error, result){
    //   console.log(result)
    //   if(result.length == 0){
        reqBody.save().then(() =>{

           console.log('added User')
           return res.status(200).send("success");
         }).catch(function(error){
           return res.status(400).send(error);
         });
       // }
      // else{
      //
      // }

    // });
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



var server = app.listen(port, () => {
  console.log(`Trivia Beat app listening at port ${port}`);
});

var io = require("socket.io")(server, {
  cors: {
    origin: "localhost:5000",
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
