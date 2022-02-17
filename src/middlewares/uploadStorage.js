import multer from 'multer'
import config from '../config/config'
const storage = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    cb(null, config.app.upload_directory)
  },
  // filename
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + '-' + file.originalname + '.png'
    )
  },
})

const fileFilter = (req, file, cb) => {
  cb(null, true)
}

const uploadStorage = multer({
  storage: storage,
  fileFilter: fileFilter,
})

export default uploadStorage
