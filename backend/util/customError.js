class CustomError extends Error {
  /**
   * Creates a new CustomError instance.
   *
   * @param {string} message - The error message.
   * @param {number} code - The custom error code.
   * @param {number|null} [httpStatus=null] - The HTTP status code (optional).
   */
  constructor(message, code, httpStatus = null) {
    super(message);
    this.code = code;
    this.name = 'CustomError';
    this.httpStatus = httpStatus;
  }
}

module.exports = CustomError;
