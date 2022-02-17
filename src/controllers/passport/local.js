import passport from 'passport'
import passportLocal from 'passport-local'
import { transErrors, tranSuccess } from '../../../lang/vi'
import { userService } from '../../services'

const LocalStrategy = passportLocal.Strategy

const applyPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await userService.getUserByEmail(email)
          if (!user)
            return done(
              null,
              false,
              req.flash('errors', transErrors.login_failed)
            )

          if (!user.local.isActive)
            return done(
              null,
              false,
              req.flash('errors', transErrors.account_not_active)
            )

          const isValidPasswd = await user.isPasswordMatch(password)
          if (!isValidPasswd)
            return done(
              null,
              false,
              req.flash('errors', transErrors.login_failed)
            )

          return done(
            null,
            user,
            req.flash('success', tranSuccess.login_success(user.firstName))
          )
        } catch (error) {
          return done(
            null,
            false,
            req.flash('errors', transErrors.server_error)
          )
        }
      }
    )
  )

  // Save user id to session
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  // Save req.user
  passport.deserializeUser((id, done) => {
    userService
      .getUserById(id)
      .then(user => done(null, user))
      .catch(error => done(error, null))
  })
}

export default applyPassportLocal
