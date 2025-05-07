const jwt = require('jsonwebtoken');
const logger = require('../util/logger');
const HTTP_CONSTANTS = require('../constants/http.constants');

/**
 * Middleware to protect routes by verifying the JWT token in cookies.
 *
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {import('express').Response|void} Returns a 401 or 403 response if unauthorized, or calls next() if authorized.
 */
const protectedRoute = (req, res, next) => {
  logger.debug('Authorization middleware triggered');

  const token = req.cookies.access_token;
  if (!token) {
    logger.warn('No access token found in cookies');
    return res.status(HTTP_CONSTANTS.CODE.UNAUTHORIZED).json({
      message: 'Unauthorized',
      code: HTTP_CONSTANTS.CUSTOM_CODE.AUTH.NO_TOKEN_FOUND,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.debug(`Token successfully verified for user: ${decoded.username}`);
    req.user = decoded;
    return next();
  } catch (error) {
    logger.debug(`Token verification failed: ${error.message}`);
    return res.status(HTTP_CONSTANTS.CODE.FORBIDDEN).json({
      message: 'Forbidden',
      code: HTTP_CONSTANTS.CUSTOM_CODE.AUTH.INVALID_TOKEN,
    });
  }
};

module.exports = protectedRoute;
