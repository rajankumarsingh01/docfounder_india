/**
 * =====================================
 * Logger Utility
 * =====================================
 */

const log = (
  message,
  data = null
) => {

  console.log(
    `[${new Date().toISOString()}]`,
    message,
    data || ""
  );
};

const error = (
  message,
  data = null
) => {

  console.error(
    `[${new Date().toISOString()}]`,
    message,
    data || ""
  );
};

module.exports = {
  log,
  error
};