const express = require('express')
const app = express()
const port = 3000
const cookieParser = require('cookie-parser')

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.setHeader("")
  res.sendFile('index.html', {root: __dirname })
})

app.get('/test', (req, res) => {
  res.send("TEST!")
})

app.get('/login', (req, res) => {
  console.log(req.body)
})
app.get('/signin', (req, res) => {
  res.sendFile('public/signin.html', {root: __dirname })
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Trivia Beat Mobile-UI app has started on port ${port}`)
})