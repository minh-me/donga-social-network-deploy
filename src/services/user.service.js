import createError from 'http-errors'
import { User } from '../models'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

/**
 * Create user
 * @param {Object} body
 * @returns {Promise<user>}
 */
const createUserLocal = async userBody => {
  const { firstName, lastName, email, password } = userBody
  const user =
    (await getUserByEmail(email)) ||
    (await getUserByUsername(email.split('@').username))
  if (user) {
    throw createError.BadRequest('Email already exists')
  }
  let item = {
    username: email.split('@')[0],
    firstName,
    lastName,
    local: {
      verifyToken: userBody.isActive ? userBody.verifyToken : uuidv4(),
      email,
      password,
      isActive: userBody?.isActive,
    },
    role: userBody?.role,
  }
  const newUser = new User(item)
  newUser.save()
  return newUser
}
/**
 * Create user
 * @param {Object} body
 * @returns {Promise<user>}
 */
const createUser = async userBody => {
  let newUser = new User(userBody)
  newUser = await newUser.save()
  return newUser
}

/**
 * Get users by query(filter, options)
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<users>}
 */
const queryUsers = async (filter, options) => {
  const customLabels = {
    docs: 'users',
    page: 'page',
    totalPages: 'totalPages',
    limit: 'limit',
    totalDocs: 'totalUsers',
  }
  options = { ...options, customLabels }
  const users = await User.paginate(filter, options)
  return users
}

/**
 * Find user by id
 * @param {ObjectId} userId
 * @returns {Promise<user>}
 */
const getUserById = async userId => {
  const user = await User.findById(userId)
  return user
}

/**
 * Find user by username
 * @param {String} username
 * @returns {Promise<user>}
 */
const getUserByUsername = async username => {
  const user = await User.findOne({ username: username })
  return user
}

/**
 * Find user by username
 * @param {Object} filter
 * @returns {Promise<Number>}
 */
const getTotalUsers = async (filter = {}) => {
  const totalUsers = await User.countDocuments(filter)
  return totalUsers
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<user>}
 */
const getUserByEmail = async email => {
  const user = await User.findOne({ 'local.email': email })
  return user
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<user>}
 */
const getUserByGoogleUid = async id => {
  const user = await User.findOne({ 'google.uid': id })
  return user
}

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<user>}
 */
const getUserByFacebookUid = async id => {
  const user = await User.findOne({ 'facebook.uid': id })
  return user
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<user>}
 */
const updateUserById = async (userId, body) => {
  const user = await getUserById(userId)

  if (!user) {
    throw createError.NotFound()
  }

  if (body.email && (await getUserByEmail(body.email))) {
    throw createError.BadRequest('Email already exists')
  }

  Object.assign(user, body)
  await user.save()
  return user
}

const updateUser = async (filter, userBody) => {
  const userUpdated = await User.findOneAndUpdate(filter, userBody, {
    new: true,
  })
  if (!userUpdated) throw createError.NotFound()
  return userUpdated
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<user>}
 */
const updateUserPasswordById = async (userId, password) => {
  const passwordHash = await bcrypt.hash(password, 8)
  const userUpdated = await User.findByIdAndUpdate(userId, {
    'local.password': passwordHash,
  })
  if (!userUpdated) throw createError.NotFound()

  return userUpdated
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<user>}
 */
const verifyUser = async token => {
  const user = await User.findOneAndUpdate(
    {
      'local.verifyToken': token,
    },
    {
      'local.verifyToken': null,
      'local.isActive': true,
    }
  )

  return user
}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} body
 * @returns {Promise<user>}
 */
const verifyUserByUserId = async userId => {
  const user = await User.findByIdAndUpdate(userId, {
    'local.verifyToken': null,
    'local.isActive': true,
  })

  return user
}

/**
 * Delte user by id
 * @param {ObjectId} userId
 * @returns {Promise<user>}
 */
const deleteUserById = async userId => {
  const user = await getUserById(userId)
  if (!user) {
    throw createError.NotFound()
  }
  const result = await user.remove()
  return result
}

/**
 * Get users by sort number followers
 * @param {Object}  options
 * @returns {Promise<users>}
 */
const getUsersBySortNumberFollowers = async (options = {}) => {
  let sort = { numberFollowers: -1 }
  if (options.sortBy === 'followers') {
    sort.numberFollowers = 1
  }

  let page = options.page || 1
  let limit = options.limit || 10
  limit = parseInt(limit, 10)
  const skip = (page - 1) * limit
  const totalUser = await User.countDocuments({})
  const totalPages = Math.ceil(totalUser / limit)

  let users = await User.aggregate([
    {
      $project: {
        local: '$local',
        _id: '$_id',
        id: '$_id',
        likes: '$likes',
        username: '$username',
        firstName: '$firstName',
        lastName: '$lastName',
        profilePic: '$profilePic',
        facebook: '$facebook',
        google: '$google',
        following: '$following',
        followers: '$followers',
        retweets: '$retweets',
        numberFollowers: { $size: '$followers' },
      },
    },
    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
  ])

  const result = {
    users,
    page,
    limit,
    totalUser,
    totalPages,
  }
  return result
}

export default {
  createUserLocal,
  createUser,
  queryUsers,
  getUserById,
  getUserByUsername,
  getTotalUsers,
  getUserByEmail,
  updateUserById,
  updateUser,
  deleteUserById,
  updateUserPasswordById,
  verifyUser,
  verifyUserByUserId,
  getUserByGoogleUid,
  getUserByFacebookUid,
  getUsersBySortNumberFollowers,
}
