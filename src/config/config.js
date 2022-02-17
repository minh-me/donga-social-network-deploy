import dotenv from 'dotenv'
dotenv.config()

export const {
  // app
  NODE_ENV: node_env,
  PORT: app_port,
  MONGODB_URL: mongodb_url,

  // jwt
  JWT_ACCESS_SECRET: accessSecret,
  JWT_ACCESS_EXPIRATION: accessExpiration,

  JWT_REFRESH_SECRET: refreshSecret,
  JWT_REFRESH_EXPIRATION: refreshExpiration,

  JWT_ACTIVATE_SECRET: activateSecret,
  JWT_ACTIVATE_EXPIRATION: activateExpiration,

  JWT_RESET_PASSWORD_SECRET: resetPasswordSecret,
  JWT_RESET_PASSWORD_EXPIRATION: resetPasswordExpiration,

  //cloud
  CLOUD_NAME: cloudName,
  CLOUD_API_KEY: cloudApiKey,
  CLOUD_API_SECRET: cloudApiSecret,

  // smtp
  SMTP_HOST: smtpHost,
  SMTP_PORT: smtpPort,
  SMTP_USERNAME: smtpUsername,
  SMTP_PASSWORD: smtpPassword,
  EMAIL_FROM: emailFrom,
  GG_APP_ID: ggAppId,
  GG_APP_SECRET: ggAppSecret,
  GG_CALLBACK_URL: ggAppCallback,
  FB_APP_ID: fbAppId,
  FB_APP_SECRET: fbAppSecret,
  FB_CALLBACK_URL: fbAppCallback,
} = process.env

const config = {
  env: node_env,
  port: app_port,
  mongodbUrl: mongodb_url,
  jwt: {
    secret: {
      access: accessSecret,
      refresh: refreshSecret,
      activate: activateSecret,
      resetPassword: resetPasswordSecret,
    },
    expiration: {
      access: accessExpiration,
      refresh: refreshExpiration,
      activate: activateExpiration,
      resetPassword: resetPasswordExpiration,
    },
    options: {
      audience: 'https://example.io',
      expiresIn: '12h', // 1d
      issuer: 'example.io',
    },
    cookie: {
      path: '/api/auth/access',
      maxAge: 1000,
      httpOnly: true,
      sameSite: true,
      signed: true,
      secure: true,
    },
  },
  cloudinaryV2: {
    config: {
      cloud_name: cloudName,
      api_key: cloudApiKey,
      api_secret: cloudApiSecret,
    },
  },
  OAuthClient: {
    clientID: ggAppId,
    clientSecret: ggAppSecret,
    callbackURL: ggAppCallback,
  },
  FBClient: {
    clientID: fbAppId,
    clientSecret: fbAppSecret,
    callbackURL: fbAppCallback,
  },
  email: {
    smtp: {
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    },
    from: emailFrom,
  },
  app: {
    max_event_listeners: 30,
    upload_directory: 'src/public/temp',
    upload_limit_size: 2097152, // 2097152 byte = 1MB
    image_types: ['image/jpg', 'image/png', 'image/jpeg'],

    message_image_types: ['image/ipg', 'image/png', 'image/jpeg'],
    message_image_limit: 3145728, //byte = 3B
  },
}
export default config
