import createError from 'http-errors'
import pick from '../utils/pick'
import catchAsync from '../utils/catchAsync'
import { postService, userService } from '../services'
import { tranSuccess } from '../../lang/en'
import User from '../models/user.model'

// Profile page
const getProfilePayload = async (username, userLoggedIn) => {
  if (!username) {
    return {
      selectedPage: 'profile',
      pageTitle: 'Profile',
      profileUser: userLoggedIn,
      userLoggedIn,
      userLoggedInJs: JSON.stringify(userLoggedIn),
    }
  }

  const user =
    (await userService.getUserByUsername(username)) ||
    (await userService.getUserById(username))
  if (user) {
    return {
      pageTitle: user.fullName,
      profileUser: user,
      userLoggedIn,
      userLoggedInJs: JSON.stringify(userLoggedIn),
    }
  }
  throw new Error('Not Found!')
}

/**
 * Create a post
 * @POST profile/
 * @access private
 */
const getProfile = async (req, res) => {
  try {
    let payload = await getProfilePayload(req.params.username, req.user)

    res.render('profile', {
      ...payload,
      selectedPage: 'profile',
      errors: req.flash('errors'),
      success: req.flash('success'),
    })
  } catch (error) {
    res.redirect('/not-found')
  }
}
/**
 * Create a post
 * @POST profile/:username/replies
 * @access private
 */
const getReplies = async (req, res) => {
  try {
    const payload = await getProfilePayload(req.params.username, req.user)
    payload['selectedTab'] = 'replies'
    res.render('profile', {
      ...payload,
      errors: req.flash('errors'),
      success: req.flash('success'),
    })
  } catch (error) {
    res.redirect('/not-found')
  }
}
/**
 * Create a post
 * @POST profile/:username
 * @access private
 */
const getProfileByUsername = async (req, res) => {
  try {
    const payload = await getProfilePayload(req.params.username, req.user)
    res.render('profile', {
      ...payload,
      errors: req.flash('errors'),
      success: req.flash('success'),
    })
  } catch (error) {
    res.redirect('/not-found')
  }
}

// [GET] /profile/:username/following
const getFollowing = async (req, res) => {
  try {
    let payload = await getProfilePayload(req.params.username, req.user)
    payload['selectedTab'] = 'following'
    return res.status(200).render('followers-following', payload)
  } catch (error) {
    res.redirect('/not-found')
  }
}

// [GET] /profile/:username/followers
const getFollowers = async (req, res) => {
  let payload = await getProfilePayload(req.params.username, req.user)
  payload['selectedTab'] = 'followers'
  return res.status(200).render('followers-following', payload)
}

export default {
  getProfile,
  getProfileByUsername,
  getReplies,
  getFollowing,
  getFollowers,
}
