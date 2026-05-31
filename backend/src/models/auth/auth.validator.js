const {
  body
} = require(
  "express-validator"
);

/**
 * =====================================
 * Register Validation
 * =====================================
 */
const registerValidation = [

  body("name")
    .notEmpty()
    .withMessage(
      "Name is required"
    )

    .isLength({
      min: 2
    })

    .withMessage(
      "Name must be at least 2 characters"
    ),

  body("email")
    .isEmail()
    .withMessage(
      "Valid email required"
    ),

  body("password")
    .isLength({
      min: 6
    })

    .withMessage(
      "Password must be at least 6 characters"
    )
];

/**
 * =====================================
 * Login Validation
 * =====================================
 */
const loginValidation = [

  body("email")
    .isEmail()
    .withMessage(
      "Valid email required"
    ),

  body("password")
    .notEmpty()
    .withMessage(
      "Password required"
    )
];


const forgotPasswordValidation = [

  body("email")
    .isEmail()
    .withMessage(
      "Valid email required"
    )
];


const resetPasswordValidation = [

  body("password")
    .isLength({
      min: 6
    })

    .withMessage(
      "Password must be at least 6 characters"
    )
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
};