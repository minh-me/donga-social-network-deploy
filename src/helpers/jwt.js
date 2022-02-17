import config from '../config/config'
import jwt from 'jsonwebtoken'

const generateToken = (payload, expiresIn, secret) => {
  return jwt.sign(payload, secret, { expiresIn })
}
const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, function (err, decoded) {
      if (err) return reject(err)
      return resolve(decoded)
    })
  )
}
export { generateToken, verifyToken }
