import nodemailer from 'nodemailer'
import config, { node_env } from '../config/config'
import logger from '../config/logger'
import { transEmail } from '../../lang/en'

// create stmp transporter
const transporter = nodemailer.createTransport(config.email.smtp)

/* istanbul ignore next */
if (node_env !== 'test') {
  transporter
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(err =>
      logger.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
        err
      )
    )
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {text|html} htmlContent
 * @returns {Promise<transporter>}
 */
const sendEmail = async (to, subject, htmlContent) => {
  let info = {
    from: config.email.from,
    to: to,
    subject: subject,
    html: htmlContent,
  }
  return transporter.sendMail(info)
}

/**
 * Send email register
 * @param {string} to
 * @param {string} url
 * @returns {Promise<transporter>}
 */
const sendEmailRegister = async (to, url) => {
  const subject = 'ACTIVATE YOUR ACCOUNT'
  // replace this url with the link to the reset password page of your front-end app
  const text = 'Verify your email'

  const title = `<span>Welcome !</span> And thank you for registering !`
  const desc = `Please validate your email by clicking the button below 🙂`
  const htmlContent = transEmail.template(title, desc, url, text)
  return sendEmail(to, subject, htmlContent)
}

/**
 * Sen email reset password
 * @param {string} to
 * @param {string} url
 * @param {string} name
 * @returns {Promise<transporter>}
 */
const sendEmailResetPassword = async (to, url, name) => {
  const subject = 'RESET YOUR PASSWORD'
  // replace this url with the link to the reset password page of your front-end app
  const text = 'Reset your password'

  const title = `<span>Hey</span> ${name}`
  const desc = 'Please click the button below to reset your password.'
  const htmlContent = transEmail.template(title, desc, url, text)
  // template_reset_password(url, text, name)
  return sendEmail(to, subject, htmlContent)
}

export default { sendEmail, sendEmailRegister, sendEmailResetPassword }
