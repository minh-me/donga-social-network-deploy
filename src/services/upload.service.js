import config from '../config/config'
import cloudinary from 'cloudinary'
import fs from 'fs'

// Config cloudinary
cloudinary.v2.config(config.cloudinaryV2.config)

/**
 * Upload file to cloudinary
 * @param {string} path link to file image in local
 * @param {string} folder store in cloudinary
 */
const upload = async (path, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(path, options, (err, result) => {
      if (err) return reject(err)
      fs.unlinkSync(path)
      return resolve(result.secure_url)
    })
  })
}

/**
 * Upload file to cloudinary
 * @param {string} path link to file image in local
 *  @returns {Promise<url>}
 */
const uploadAvatar = async path => {
  const options = {
    folder: 'avatar',
    width: 150,
    height: 150,
    crop: 'fill',
  }
  const url = await upload(path, options)
  return url
}

/**
 * Upload file to cloudinary
 * @param {string} path link to file image in local
 *  @returns {Promise<url>}
 */
const uploadCoverPhoto = async path => {
  const options = {
    folder: 'coverPhoto',
    crop: 'fill',
  }
  const url = await upload(path, options)
  return url
}

const uploadPostImage = async path => {
  const options = {
    folder: 'postImage',
    crop: 'fill',
  }
  const url = await upload(path, options)
  return url
}

const uploadMessageImage = async path => {
  const options = {
    folder: 'messageImage',
    crop: 'fill',
  }
  const url = await upload(path, options)
  return url
}
export default {
  upload,
  uploadAvatar,
  uploadCoverPhoto,
  uploadPostImage,
  uploadMessageImage,
}
