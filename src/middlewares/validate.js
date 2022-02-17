import httpError from 'http-errors'
import logger from '../config/logger'
import { object } from 'yup'

const validate = schema => (req, res, next) => {
  try {
    const obj = {
      ...req.body,
      ...req.params,
      ...req.query,
    }

    const value = object(schema).noUnknown().validateSync(obj, {
      abortEarly: false,
      stripUnknown: false,
    })

    Object.assign(req, value)
    return next()
  } catch (error) {
    next(new httpError.BadRequest(error.errors))
  }
}
const validateBody = schema => (req, res, next) => {
  req.body.valueChecked = new Promise((resolve, reject) => {
    try {
      const value = object(schema).validateSync(req.body, { abortEarly: false })
      resolve(value)
    } catch (error) {
      reject(error)
    }
  })
  next()
}
export { validateBody }
export default validate
