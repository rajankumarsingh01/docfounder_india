/**
 * Standard API Response
 *
 * Har API same structure return karegi
 */

class ApiResponse {
  constructor(
    success,
    message,
    data = null
  ) {
    this.success = success;

    this.message = message;

    this.data = data;
  }
}

module.exports = ApiResponse;