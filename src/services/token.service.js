import jwt from 'jsonwebtoken'
import { transErrors } from '../../lang/en'
import httpError from 'http-errors'
import {
  accessSecret,
  accessExpiration,
  refreshSecret,
  refreshExpiration,
  activateSecret,
  activateExpiration,
  resetPasswordSecret,
  resetPasswordExpiration,
} from '../config/config'
import userService from './user.service'

/**
 * private function generateToken
 * @param {object} payload
 * @param {string} secretSignature
 * @param {number|string(date)} tokenLife
 * @returns
 */
const generateToken = (payload, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secretSignature,
      { expiresIn: tokenLife },
      (error, token) => {
        if (error) {
          return reject(httpError.Unauthorized(error.message))
        }
        resolve(token)
      }
    )
  })
}
/**
 * This module used for verify jwt token
 * @param {string} token
 * @param {string} secretKey
 * @returns {Promsie<decoded>}
 */
const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(httpError.Unauthorized(error.message))
      }
      resolve(decoded)
    })
  })
}

/**
 * Generate activation token to confirm account
 * @param {object} user
 * @returns
 */
const generateActivationToken = async userBody => {
  const user = await userService.getUserByEmail(userBody.email)
  if (user) throw new httpError.BadRequest(transErrors.account_in_use)

  const token = await generateToken(
    userBody,
    activateSecret,
    activateExpiration
  )
  return token
}

/**
 * Generate refresh token
 * @param {string} userId
 * @returns {Promise<token>}
 */
const generateRefreshToken = async userId => {
  const token = await generateToken(
    { sub: userId },
    refreshSecret,
    refreshExpiration
  )
  return token
}

/**
 * Generate access token
 * @param {string} userId
 * @returns {Promise<token>}
 */
const generateAccessToken = async userId => {
  const token = await generateToken(
    { sub: userId },
    accessSecret,
    accessExpiration
  )
  return token
}

/**
 * Generate reset password token
 * @param {string} userId
 * @returns {Promise<token>}
 */
const generateResetPasswordToken = async email => {
  const user = await userService.getUserByEmail(email)
  if (!user) throw httpError.BadRequest(transErrors.email_undefined)
  const token = await generateToken(
    { sub: user.id },
    resetPasswordSecret,
    resetPasswordExpiration
  )
  return token
}

/**
 *  Verify activation token
 * @param {string} userId
 * @returns {Promise<user>}
 */
const verifyActivationToken = async token => {
  return await verifyToken(token, activateSecret)
}

/**
 *  Verify activation token
 * @param {string} userId
 * @returns {Promise<sub>}
 */
const verifyRefreshToken = async token => {
  return await verifyToken(token, refreshSecret)
}

export default {
  generateToken,
  verifyToken,
  generateActivationToken,
  generateRefreshToken,
  generateAccessToken,
  generateResetPasswordToken,
  verifyActivationToken,
  verifyRefreshToken,
}
