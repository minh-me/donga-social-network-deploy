import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { roles } from '../config/roles'
import { transValidations } from '../../lang/en'
import toJSON from './plugins/toJson'
import paginate from './plugins/paginate'

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: { type: String },
    address: { type: String, default: null },
    profilePic: {
      type: String,
      default:
        'https://res.cloudinary.com/djvd6zhbg/image/upload/v1639037693/avatar/avatar-default_emyynu.png',
    },
    coverPhoto: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    local: {
      email: {
        type: String,
        trim: true,
        max: 50,
        lowercase: true,
      },
      password: { type: String, min: 6, max: 50 },
      isActive: { type: Boolean, default: false },
      verifyToken: String,
    },
    facebook: {
      uid: String,
      token: String,
      email: String,
    },
    google: {
      uid: String,
      token: String,
      email: String,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.local.password
        return ret
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.local.password
        return ret
      },
    },
  }
)

userSchema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (this.isModified('local.password')) {
    this.local.password = await bcrypt.hash(this.local.password, 8)
  }
  next()
})

// Create a virtual property `fullName` that's computed from `fistname and lastname`.
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

userSchema.methods = {
  /**
   * Check if password matches the user's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async isPasswordMatch(password) {
    return bcrypt.compare(password, this.local.password)
  },
}

// add plugin that converts mongoose to json
userSchema.plugin(toJSON)
userSchema.plugin(paginate)

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema)

export default User
