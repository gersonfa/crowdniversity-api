var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var helmet = require('helmet')
var favicon = require('serve-favicon')
var port = process.env.PORT || 3000
var mongoose = require('mongoose')
var config = require('./config/dev')
const options = require('./config/config')
var passport = require('passport')
var multipart = require('connect-multiparty')
const router = require('./routes/index')

mongoose.Promise = require('bluebird')
mongoose.connect(config.database)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(logger('dev'))
app.use(helmet())

app.use(passport.initialize())


app.use(multipart({
  uploadDir: options.uploads
}))

app.use('/', express.static('../public'))

app.listen(port, console.log('Listening in port: ' + port))

router(app)