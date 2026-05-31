const rateLimit =
  require("express-rate-limit");

/**
 * General API Limiter
 */
const apiLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 100,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many requests. Please try again later."
    }
  });

/**
 * Upload Limiter
 *
 * Prevent spam uploads
 */
const uploadLimiter =
  rateLimit({

    windowMs:
      60 * 60 * 1000,

    max: 20,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Upload limit exceeded."
    }
  });

module.exports = {
  apiLimiter,
  uploadLimiter
};