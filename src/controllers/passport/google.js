import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'
import { transErrors, tranSuccess } from '../../../lang/vi'
import config from '../../config/config'
import { userService } from '../../services'
import { v4 as uuidV4 } from 'uuid'

const GoogleStrategy = passportGoogle.Strategy

function applyPassportGoogle() {
  passport.use(
    new GoogleStrategy(
      {
        ...config.OAuthClient,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const user =
            (await userService.getUserByUsername(
              profile?.emails[0].value.split('@')[0]
            )) || (await userService.getUserByGoogleUid(profile.id))

          if (user)
            return done(
              null,
              user,
              req.flash('success', tranSuccess.login_success(user.fullName))
            )
          let newUserItem = {
            username: profile.emails[0].value.split('@')[0],
            firstName: profile.name.familyName,
            lastName: profile.name.givenName,
            local: { isActive: true, password: profile.id + uuidV4() },
            profilePic: profile.photos[0].value,
            google: {
              uid: profile.id,
              token: accessToken,
              email: profile.emails[0].value,
            },
          }
          const newUser = await userService.createUser(newUserItem)
          return done(
            null,
            newUser,
            req.flash('success', tranSuccess.login_success(newUser.fullName))
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
export default applyPassportGoogle
