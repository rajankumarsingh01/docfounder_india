const { v4: uuidv4 } =
  require("uuid");

/**
 * Unique Request ID
 */

const requestIdMiddleware =
  (req, res, next) => {

    req.requestId =
      uuidv4();

    res.setHeader(
      "X-Request-Id",
      req.requestId
    );

    next();
  };

module.exports =
  requestIdMiddleware;