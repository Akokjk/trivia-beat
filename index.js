const express = require('express')
const app = express()
const port = 3000
const cookieParser = require('cookie-parser')

app.use(require('cors')())

app.use(express.static('public'))
// app.get('/', (req, res) => {
//   res.setHeader("")
//    res.sendFile('index.html', {root: __dirname })
// })

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

var server = app.listen(port, '127.0.0.1', () => {
  console.log(`Trivia Beat app listening at port ${port}`)
})

var io = require('socket.io')(server, {
  cors: {
       origin: "*",
       methods: ["GET", "POST"]
   }
});

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);

        // Send it to all other clients
        socket.broadcast.emit('mouse', data);

        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
});
