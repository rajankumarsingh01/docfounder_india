const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");

const AppError =
  require("../utils/AppError");

const env =
  require("../config/env");

const protect =
  async (
    req,
    res,
    next
  ) => {

    try {

      let token;

      const authHeader =
        req.headers.authorization;

      if (
        authHeader &&
        authHeader.startsWith(
          "Bearer "
        )
      ) {

        token =
          authHeader.split(
            " "
          )[1];
      }

      if (!token) {

        return next(
          new AppError(
            "Not Authorized",
            401
          )
        );
      }

      const decoded =
        jwt.verify(
          token,
          env.JWT_SECRET
        );

      const user =
        await User.findById(
          decoded.userId
        ).select(
          "-password"
        );

      if (!user) {

        return next(
          new AppError(
            "User Not Found",
            401
          )
        );
      }

      req.user = user;

      next();

    } catch (error) {

      next(
        new AppError(
          "Invalid Token",
          401
        )
      );
    }
  };

module.exports = {
  protect
};