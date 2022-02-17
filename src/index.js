import app from './app'
import config from './config/config'
import logger from './config/logger'
import 'colors'
import { Server } from 'socket.io'

const runningApp = () => {
  // Init server
  const server = app.listen(
    config.port,
    logger.info(
      // `Server running in ${config.env} mode on port ${config.port}`.cyan
      `Server running in ${config.env} at http://localhost:${config.port}`.cyan
        .underline
    )
  )

  // Socket
  const io = new Server(server, {})
  io.on('connection', socket => {
    // logger.info('Connected to socket io.')

    // Setup
    socket.on('setup', user => {
      socket.join(user.id)
      socket.emit('connected')
    })

    // Join room chat
    socket.on('join-room', room => socket.join(room))
    // Typing
    socket.on('typing', room => socket.to(room).emit('typing'))
    socket.on('stop-typing', room => socket.to(room).emit('stop-typing'))

    // Notification
    socket.on('notification-received', room =>
      socket.to(room).emit('notification-received', room)
    )

    // Message
    socket.on('new-message', message => {
      let chat = message.chat
      if (!chat.users) return console.log('Chat.users not defined')
      chat.users.forEach(user => {
        if (user === message.sender.id) return
        socket.to(user).emit('message-received', message)
      })
    })
  })

  // Handle unhandled promise rejections
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed')
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  }
  const unexpectedErrorHandler = error => {
    logger.error(error)
    exitHandler()
  }
  process.on('uncaughtException', unexpectedErrorHandler)
  process.on('unhandledRejection', unexpectedErrorHandler)

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received')
    if (server) {
      server.close()
    }
  })
}
runningApp()
