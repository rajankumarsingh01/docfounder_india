const jwt = require("jsonwebtoken");

const env =
  require("../config/env");

/**
 * =====================================
 * Generate JWT Access Token
 * =====================================
 */

const generateToken =
  (userId, role) => {

    return jwt.sign(
      {
        userId,
        role
      },

      env.JWT_SECRET,

      {
        expiresIn:
          env.JWT_EXPIRE
      }
    );
  };

module.exports =
  generateToken;