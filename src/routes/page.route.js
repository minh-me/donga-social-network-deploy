import { Router } from 'express'
import {
  requireLoggedIn,
  requireLoggedOut,
  requireAdminLoggedOut,
  requireAdminLoggedIn,
} from '../middlewares/auth'
import {
  chatService,
  messageService,
  notificationService,
  postService,
  userService,
} from '../services'

const router = new Router()

router.get('/auth/admin/sign_in', requireAdminLoggedOut, (req, res) => {
  res.render('layouts/auth-layout', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/auth/login', requireLoggedOut, (req, res) => {
  res.render('auth/login', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/auth/register', requireLoggedOut, (req, res) => {
  res.render('auth/register', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/auth/forgot_password', requireLoggedOut, (req, res) => {
  res.render('auth/forgot_password', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/auth/reset_password/:token', requireLoggedOut, (req, res) => {
  res.render('auth/reset_password', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  })
})

router.get('/admin', requireAdminLoggedIn, async (req, res) => {
  const totalUsers = await userService.getTotalUsers()
  const totalPosts = await postService.getTotalPosts()
  const totalManagers = await userService.getTotalUsers({ role: 'admin' })
  const totalNotifications = await notificationService.getTotalNotifications()
  const totalMessages = await messageService.getTotalMessages()
  const totalChats = await chatService.getTotalChats()
  res.render('admin/admin-layout', {
    totalUsers,
    totalPosts,
    totalManagers,
    totalMessages,
    totalNotifications,
    totalChats,
    userLoggedIn: req.user,
  })
})
router.get('/', requireLoggedIn, (req, res) => {
  res.render('home', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    pageTitle: 'Home',
    selectedPage: 'home',
    userLoggedIn: req.user,
    userLoggedInJs: JSON.stringify(req.user),
  })
})

export default router
