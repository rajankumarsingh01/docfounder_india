/**
 * Async Error Wrapper
 *
 * Har async controller ko
 * try/catch se bachata hai
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(
      fn(req, res, next)
    ).catch(next);
  };
};

module.exports = asyncHandler;