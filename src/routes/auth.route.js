import { Router } from 'express'
import passport from 'passport'
import { requireLoggedIn, requireAdminLoggedIn } from '../middlewares/auth'
import { validateBody } from '../middlewares/validate'
import { authValidation } from '../validations'
import {
  authController,
  applyPassportLocal,
  applyPassportGoogle,
  applyPassportFacebook,
} from '../controllers'

// init passport
applyPassportLocal()
applyPassportGoogle()
applyPassportFacebook()

const router = new Router()

router.post(
  '/register',
  validateBody(authValidation.register),
  authController.register
)
router.get('/activate/:token', authController.activate)

// Login with google

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function (req, res) {
    res.redirect('/')
  }
)

// Login with facebook

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
    successFlash: true,
    failureFlash: true,
  })
)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  })
)
// Login with local
router.post(
  '/login',
  validateBody(authValidation.login),
  async (req, res, next) => {
    try {
      // Get cred
      await req.body.valueChecked
      next()
    } catch (error) {
      req.flash(
        'errors',
        (error.errors && error.errors[0]) || transErrors.account_in_use
      )
      return res.redirect('/auth/login')
    }
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    successFlash: true,
    failureFlash: true,
  })
)

// Lgin admin
router.post(
  '/admin/sign_in',
  validateBody(authValidation.login),
  async (req, res, next) => {
    try {
      // Get cred
      await req.body.valueChecked
      next()
    } catch (error) {
      req.flash(
        'errors',
        (error.errors && error.errors[0]) || transErrors.account_in_use
      )
      return res.redirect('/auth/admin/sign_in')
    }
  },
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/auth/admin/sign_in',
    successFlash: true,
    failureFlash: true,
  })
)

router.post(
  '/forgot_password',
  validateBody(authValidation.forgotPassword),
  authController.forgotPassword
)

router.post(
  '/reset_password/:token',
  validateBody(authValidation.resetPassword),
  authController.resetPassword
)

router.get('/admin/sign_out', requireAdminLoggedIn, authController.adminLogout)
router.get('/logout', requireLoggedIn, authController.logout)

export default router
