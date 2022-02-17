import rateLimit from 'express-rate-limit'

// limter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
})

// auth rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
})

export { authLimiter }
export default limiter
