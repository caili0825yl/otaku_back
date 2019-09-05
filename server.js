require('express-async-errors')
const winston = require('winston')
const express = require('express')
const article = require('./router/article')
const auth = require('./router/auth')
const user = require('./router/user')
const cors = require('cors')
const cookie = require('cookie-parser')
const app = express()

app.use(express.static(__dirname + '/public'))


winston.handleExceptions(new winston.transports.File({ filename: 'uncaughtExceptions.log' }))

process.on('unhandledRejection', ex => {
  throw ex
})


var corsOptions = {
  origin: /http\:\/\/localhost\:(\d)+/,
  optionsSuccessStatus: 200 ,
  credentials  :true
}


app.use(cors(corsOptions))
winston.add(winston.transports.File, { filename: 'error.log' })
app.use(cookie())



app.use(express.json())



app.use('/api/article', article)
app.use('/api/user', user)
app.use('/api/auth', auth)
app.use(require('./error'))



app.listen(3050, () => {
  console.log('http://localhost:3050')
})
