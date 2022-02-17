import { Router } from 'express'
import authRoutes from './auth.route'
import userRoutes from './user.route'
import uploadRoutes from './upload.route'
import pageRoutes from './page.route'
import postRoutes from './post.route'
import profileRoutes from './profile.route'
import searchRoutes from './search.route'
import messageRoutes from './message.route'
import chatRoutes from './chat.route'
import notificationRoutes from './notification.route'

const router = new Router()

const defaultRoutes = [
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/chats',
    route: chatRoutes,
  },
  {
    path: '/messages',
    route: messageRoutes,
  },
  {
    path: '/search',
    route: searchRoutes,
  },
  {
    path: '/profile',
    route: profileRoutes,
  },
  {
    path: '/posts',
    route: postRoutes,
  },
  {
    path: '/uploads',
    route: uploadRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/',
    route: pageRoutes,
  },
]

defaultRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
