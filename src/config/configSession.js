import session from 'express-session'
import MongoStore from 'connect-mongo'
import config from './config'

let sessionStore = MongoStore.create({
  mongoUrl: config.mongodbUrl,
  autoRemove: 'native',
})

const configSession = app => {
  app.use(
    session({
      secret: 'keyboard cat',
      store: sessionStore,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 86400 seconds = 1 day
      },
    })
  )
}

export default configSession
