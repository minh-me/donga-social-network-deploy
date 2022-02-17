import createHttpError, { HttpError } from 'http-errors'
import { node_env } from '../config/config'
import logger from '../config/logger'

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log to console for dev
  logger.error(err)

  if (err instanceof HttpError) {
    error.statusCode = err.statusCode
  }

  if (err.name === 'CastError') {
    // Mongoose bad ObjectId
    const message = `Resource not found`
    error = new createHttpError.NotFound(message)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new createHttpError.BadRequest(message)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message)
    error = new createHttpError.BadRequest(message)
  }

  res.status(error.statusCode || 500).json({
    name: err.name,
    code: error.statusCode || 500,
    message:
      (error.statusCode && error.message) ||
      createHttpError.InternalServerError().message,
  })
}

export default errorHandler
