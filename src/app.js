import express from 'express'
import path from 'path'
import morgan from 'morgan'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
// import helmet from 'helmet'
import xss from 'xss-clean'
import hpp from 'hpp'
import cors from 'cors'
import flash from 'connect-flash'
import 'colors'

import { jwtStrategy } from './config/passport'
import config from './config/config'
import db from './config/db'
import { authLimiter } from './config/rateLimit'
import errorHandler from './middlewares/error'
import routes from './routes/_index'
import configViewEngine from './config/viewEngine'
import configSession from './config/configSession'

// connect to database
db.connect()

// init app
const app = express()

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', '')
  next()
})

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// config view engine pug
configViewEngine(app, path.join(__dirname, 'views'))

// Config session
configSession(app)

// Enable flash message
app.use(flash())

// body parser
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// cookie parser
app.use(cookieParser(config.jwt.secret.refresh))

// dev logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'))
}

// sanitize data
app.use(mongoSanitize())

// set security headers
// app.use(helmet())

// prevent XSS attacks
app.use(xss())

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/auth', authLimiter)
}

// prevent http param pollution
app.use(hpp())

// enable CORS
app.use(cors())

// jwt authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use('jwt', jwtStrategy)

// api routes
app.use('/', routes)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  res.render('not_found')
})

// handle error
app.use(errorHandler)

export default app
