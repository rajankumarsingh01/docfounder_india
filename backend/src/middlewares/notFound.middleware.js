const AppError = require(
  "../utils/AppError"
);

/**
 * Route Not Found
 */

const notFoundMiddleware = (
  req,
  res,
  next
) => {
  next(
    new AppError(
      `Route Not Found: ${req.originalUrl}`,
      404
    )
  );
};

module.exports =
  notFoundMiddleware;