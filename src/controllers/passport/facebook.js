import passport from 'passport'
import passportFacebook from 'passport-facebook'
import { transErrors, tranSuccess } from '../../../lang/vi'
import config from '../../config/config'
import { userService } from '../../services'
import { v4 as uuidV4 } from 'uuid'

const FacebookStrategy = passportFacebook.Strategy

function applyPassportFacebook() {
  passport.use(
    new FacebookStrategy(
      {
        ...config.FBClient,
        passReqToCallback: true,
        profileFields: ['email', 'gender', 'name', 'displayName'],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const user =
            (await userService.getUserByFacebookUid(profile.id)) ||
            (await userService.getUserByUsername(
              profile?.emails[0].value.split('@')[0]
            ))
          if (user)
            return done(
              null,
              user,
              req.flash('success', tranSuccess.login_success(user.fullName))
            )
          let newUserItem = {
            username: profile?.emails[0].value.split('@')[0] || `${id}`,
            firstName: profile._json.first_name || profile.name.givenName,
            lastName: profile.name.familyName || profile.name.givenName,
            local: { isActive: true, password: profile.id + uuidV4() },
            facebook: {
              uid: profile.id,
              token: accessToken,
              email: profile?.emails[0].value || `${id}@gmail.com`,
            },
          }
          const newUser = await userService.createUser(newUserItem)
          return done(
            null,
            user,
            req.flash('success', tranSuccess.login_success(newUser.fullName))
          )
        } catch (error) {
          console.log({ passportFacebookERROR: error })
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
export default applyPassportFacebook
