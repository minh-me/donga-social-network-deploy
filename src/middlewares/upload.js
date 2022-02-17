import fs from 'fs'
import createHttpError from 'http-errors'
import config from '../config/config'
import { transErrors } from '../../lang/en'

const upload = (req, res, next) => {
  // check file exist
  // req.file is the `image` file
  // req.body will hold the text fields, if there were any
  if (typeof req.file === 'undefined' || typeof req.body === 'undefined')
    throw new createHttpError.BadRequest(transErrors.upload_issue)

  // app use upload
  const image = req.file.path
  // file type
  if (!config.app.image_types.includes(req.file.mimetype)) {
    // remove file
    fs.unlinkSync(image)
    throw new createHttpError.BadRequest(transErrors.upload_not_supported)
  }

  // file size
  if (req.file.size > config.app.upload_limit_size) {
    // remove file
    fs.unlinkSync(image)
    throw new createHttpError.BadRequest(transErrors.upload_limit_size)
  }

  // success
  next()
}

const uploadPostImage = (req, res, next) => {
  if (req.file) {
    // app use upload
    const image = req.file.path
    // file type
    if (!config.app.image_types.includes(req.file.mimetype)) {
      // remove file
      fs.unlinkSync(image)
      throw new createHttpError.BadRequest(transErrors.upload_not_supported)
    }

    // file size
    if (req.file.size > config.app.upload_limit_size) {
      // remove file
      fs.unlinkSync(image)
      throw new createHttpError.BadRequest(transErrors.upload_limit_size)
    }
  }
  next()
}
const uploadMessageImage = (req, res, next) => {
  if (req.file) {
    // app use upload
    const image = req.file.path
    // file type
    if (!config.app.message_image_types.includes(req.file.mimetype)) {
      // remove file
      fs.unlinkSync(image)
      throw new createHttpError.BadRequest(transErrors.upload_not_supported)
    }

    // file size
    if (req.file.size > config.app.message_image_limit) {
      // remove file
      fs.unlinkSync(image)
      throw new createHttpError.BadRequest(transErrors.upload_limit_size)
    }
  }
  next()
}
export { uploadPostImage, uploadMessageImage }
export default upload
