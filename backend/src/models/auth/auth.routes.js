const express =
  require("express");

const router =
  express.Router();

const authController =
  require(
    "./auth.controller"
  );

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require(
  "./auth.validator"
);

const {
  protect
} = require(
  "../../middlewares/auth.middleware"
);

/**
 * =====================================
 * Register
 * =====================================
 */
router.post(
  "/register",

  registerValidation,

  authController.register
);

/**
 * =====================================
 * Login
 * =====================================
 */
router.post(
  "/login",

  loginValidation,

  authController.login
);

/**
 * =====================================
 * Get Current User
 * =====================================
 */
router.get(
  "/me",

  protect,

  authController.getMe
);

/**
 * Forgot Password
 */
router.post(
  "/forgot-password",

  forgotPasswordValidation,

  authController.forgotPassword
);

/**
 * Reset Password
 */
router.post(
  "/reset-password/:token",

  resetPasswordValidation,

  authController.resetPassword
);

module.exports =
  router;