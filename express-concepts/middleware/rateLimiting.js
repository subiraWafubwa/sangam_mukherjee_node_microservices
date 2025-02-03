const rateLimit = require("express-rate-limit");

const createBasicRateLimiter = (maxRequests, timeWindow) => {
  return rateLimit({
    max: maxRequests,
    windowMs: timeWindow,
    message: "Too many requests, please try again later.",
    standardHeaders: true, // Returns rate limit info in the `RateLimit-* headers
    legacyHeaders: false, // Disable rate limit info in the `X-RateLimit-* headers
  });
};

module.exports = { createBasicRateLimiter };
