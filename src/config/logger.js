import { createLogger, transports, format } from 'winston'
import config from './config.js'
const { combine, colorize, uncolorize, label, splat, printf } = format

// enumerate error
const enumerateErrorFormat = format(info => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})
const logConfiguration = {
  level: config.env === 'development' ? 'debug' : 'info',
  transports: [new transports.Console()],
  format: combine(
    enumerateErrorFormat(),
    config.env === 'development' ? colorize({ all: true }) : uncolorize(),
    label({
      label: __filename.split('/').pop(),
    }),
    splat(),
    printf(info => `${info.level}`.bold + `: ${info.message}`)
  ),
}

const logger = createLogger(logConfiguration)

export default logger
