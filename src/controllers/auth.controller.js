import passport from 'passport'
import catchAsync from '../utils/catchAsync'
import { tranSuccess, transErrors, transEmail } from '../../lang/vi'
import {
  userService,
  authService,
  emailService,
  tokenService,
} from '../services'
import config from '../config/config'
/**
 * Register user
 * @POST /auth/register
 * @access public
 */
const register = async (req, res) => {
  try {
    // Get cred
    const { firstName, lastName, email, password } = await req.body.valueChecked

    // create user
    const user = await userService.createUserLocal({
      firstName,
      lastName,
      email,
      password,
    })

    const url = `${req.protocol}://${req.get('host')}/auth/activate/${
      user.local.verifyToken
    }`
    // Send mail
    await emailService
      .sendEmailRegister(user.local.email, url)
      .catch(async error => {
        // remove account
        await userService.deleteUserById(user._id)
        req.flash('errors', transEmail.send_failed)
      })

    // success
    req.flash('success', tranSuccess.userRegisted(user.local.email))
    return res.redirect('/auth/login')
  } catch (error) {
    req.flash(
      'errors',
      (error.errors && error.errors[0]) || transErrors.account_in_use
    )
    return res.redirect('/auth/register')
  }
}

/**
 * Acitvation user
 * @POST auth/activate/:token
 * @private public
 */
const activate = async (req, res) => {
  try {
    // verify token
    const user = await authService.verifyActivationToken(req.params.token)
    // add user
    req.flash('success', tranSuccess.account_actived)
    res.redirect('/auth/login')
  } catch (error) {
    req.flash('errors', transErrors.token_undefined)
    res.redirect('/auth/login')
  }
}

/**
 * Fotgot password
 * @POST auth/forgot_password
 * @access public
 */
const forgotPassword = async (req, res) => {
  try {
    // Get cred
    const { email } = await req.body.valueChecked

    // Get user
    const user = await userService.getUserByEmail(email)
    if (!user) {
      req.flash('errors', transErrors.account_undefined)
      return res.redirect('/auth/forgot_password')
    }

    const token = await tokenService.generateToken(
      { sub: user._id },
      config.jwt.secret.resetPassword,
      config.jwt.expiration.resetPassword
    )

    const url = `${req.protocol}://${req.get(
      'host'
    )}/auth/reset_password/${token}`

    // Send mail
    await emailService.sendEmailResetPassword(
      user.local.email,
      url,
      user.fullName
    )

    req.flash('success', transEmail.send_success)
    return res.redirect('/auth/forgot_password')
  } catch (error) {
    console.log({ error })
    req.flash(
      'errors',
      (error.errors && error.errors[0]) || transErrors.server_error
    )
    return res.redirect('/auth/forgot_password')
  }
}

/**
 * Reset password
 * @POST api/reset-password
 * @private public
 */
const resetPassword = catchAsync(async (req, res) => {
  // reset success
  try {
    const { password } = await req.body.valueChecked
    const { sub } = await tokenService.verifyToken(
      req.params.token,
      config.jwt.secret.resetPassword
    )
    await userService.updateUserPasswordById(sub, password)
    req.flash(
      'success',
      'Mật khẩu của bạn đã thay đổi thành công. Hãy đăng nhập lại!'
    )
    return res.redirect(`/auth/login`)
  } catch (error) {
    req.flash('errors', (error.errors && error.errors[0]) || error.message)
    return res.redirect(`/auth/reset_password/${req.params.token}`)
  }
})

/**
 * Logout user
 * @GET api/logout
 * @access private
 */
const logout = catchAsync(async (req, res) => {
  req.logout() // remove passport on session

  req.flash('success', tranSuccess.logout_success)
  res.redirect('/auth/login')
})
/**
 * Logout user
 * @GET api/logout
 * @access private
 */
const adminLogout = catchAsync(async (req, res) => {
  req.logout() // remove passport on session

  req.flash('success', tranSuccess.logout_success)
  res.redirect('/auth/admin/sign_in')
})

export default {
  register,
  activate,
  forgotPassword,
  resetPassword,
  logout,
  adminLogout,
}
