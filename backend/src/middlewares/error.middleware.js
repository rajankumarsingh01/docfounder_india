const logger =
  require("../utils/logger");

const errorMiddleware =
  (
    err,
    req,
    res,
    next
  ) => {

    logger.error(
      "API ERROR",
      {
        requestId:
          req.requestId,

        message:
          err.message
      }
    );

    res.status(
      err.statusCode || 500
    ).json({

      success: false,

      requestId:
        req.requestId,

      message:
        err.message ||
        "Internal Server Error"
    });
  };

module.exports =
  errorMiddleware;