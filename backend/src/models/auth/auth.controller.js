const {
  validationResult
} = require(
  "express-validator"
);

const ApiResponse =
  require(
    "../../utils/ApiResponse"
  );

const authService =
  require(
    "./auth.service"
  );

/**
 * =====================================
 * Register
 * =====================================
 */
const register =
  async (
    req,
    res,
    next
  ) => {

    try {

      const errors =
        validationResult(
          req
        );

      if (
        !errors.isEmpty()
      ) {

        return res
          .status(400)
          .json(
            new ApiResponse(
              false,
              "Validation Failed",
              errors.array()
            )
          );
      }

      const result =
        await authService
          .registerUser(
            req.body
          );

      return res
        .status(201)
        .json(
          new ApiResponse(
            true,
            "User Registered Successfully",
            result
          )
        );

    } catch (error) {

  console.log(
    "================================="
  );

  console.log(
    "AUTH ERROR =>"
  );

  console.log(error);

  console.log(
    "STACK =>",
    error.stack
  );

  console.log(
    "================================="
  );

  next(error);
};
  };

/**
 * =====================================
 * Login
 * =====================================
 */
const login =
  async (
    req,
    res,
    next
  ) => {

    try {

      const errors =
        validationResult(
          req
        );

      if (
        !errors.isEmpty()
      ) {

        return res
          .status(400)
          .json(
            new ApiResponse(
              false,
              "Validation Failed",
              errors.array()
            )
          );
      }

      const result =
        await authService
          .loginUser(
            req.body
          );

      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            "Login Successful",
            result
          )
        );

    } catch (error) {
      next(error);
    }
  };



  /**
 * =====================================
 * Get Current User
 * =====================================
 */
const getMe =
  async (
    req,
    res,
    next
  ) => {

    try {

      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            "User Profile",
            req.user
          )
        );

    } catch (error) {
      next(error);
    }
  };

 const forgotPassword =
  async (
    req,
    res,
    next
  ) => {

    try {

      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {

        return res
          .status(400)
          .json(
            new ApiResponse(
              false,
              "Validation Failed",
              errors.array()
            )
          );
      }

      await authService
        .forgotPassword(
          req.body.email
        );

      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            "Password reset email sent"
          )
        );

    } catch (error) {
      next(error);
    }
  }; 

  const resetPassword =
  async (
    req,
    res,
    next
  ) => {

    try {

      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {

        return res
          .status(400)
          .json(
            new ApiResponse(
              false,
              "Validation Failed",
              errors.array()
            )
          );
      }

      await authService
        .resetPassword(
          req.params.token,
          req.body.password
        );

      return res
        .status(200)
        .json(
          new ApiResponse(
            true,
            "Password reset successful"
          )
        );

    } catch (error) {
      next(error);
    }
  };

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
};
