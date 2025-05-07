const jwt = require('jsonwebtoken');
const models = require('../database/models').models;
const logger = require('../util/logger');
const MODEL_CONSTANTS = require('../constants/model.constants');
const HTTP_CONSTANTS = require('../constants/http.constants');
const CustomError = require('../util/customError');
const argon2 = require('argon2');

const JWT_SECRET = process.env.JWT_SECRET;
const TAG = 'AuthController';

/**
 * Handles user login by validating credentials, generating a JWT token, and setting it in a cookie.
 *
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 * @returns {Promise<import('express').Response>} The HTTP response with a success or error message.
 */
exports.login = async (req, res) => {
  try {
    logger.info('Login attempt started');

    const user = await validateUser(req.body);
    logger.info(`User validated successfully: ${user.username}`);

    exports.signJwt(user, res);
    logger.debug(`JWT token generated for user: ${user.username}`);

    return res.status(HTTP_CONSTANTS.CODE.OK).json({
      message: 'Logged in successfully',
      code: HTTP_CONSTANTS.CODE.OK,
      data: {
        username: user.username,
        permission: user.permission,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);

    if (error instanceof CustomError) {
      return res.status(error.status || HTTP_CONSTANTS.CODE.BAD_REQUEST).json({
        message: error.message,
        code: error.code,
      });
    }

    return res.status(HTTP_CONSTANTS.CODE.INTERNAL_SERVER_ERROR).json({
      message: 'An unexpected error occurred',
      code: HTTP_CONSTANTS.CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Validates the registration data to ensure it meets the required criteria.
 *
 * @param {Object} givenData - The data provided for registration.
 * @param {string} givenData.password - The user's password.
 * @param {string} givenData.passwordConfirmation - The confirmation of the user's password.
 * @param {string} givenData.permission - The permission level of the user (e.g., 'admin', 'user').
 * @throws {CustomError} If the data is invalid (e.g., missing fields, mismatched passwords, or invalid permissions).
 * @returns {boolean} Returns `true` if the data is valid.
 */
/**
 * Validates the registration data to ensure it meets the required criteria.
 *
 * @param {Object} givenData - The data provided for registration.
 * @param {string} givenData.password - The user's password.
 * @param {string} givenData.passwordConfirmation - The confirmation of the user's password.
 * @param {string} givenData.permission - The permission level of the user (e.g., 'admin', 'user').
 * @throws {CustomError} If the data is invalid (e.g., missing fields, mismatched passwords, or invalid permissions).
 * @returns {boolean} Returns `true` if the data is valid.
 */
exports.checkDataForRegistration = (givenData) => {
  const { password, confirmPassword, permission, email } = givenData;

  logger.info(`[${TAG}] Validating registration data`);

  if (!password || !confirmPassword || !email) {
    logger.warn(
      `[${TAG}] Missing required fields: password, confirmation, or email`
    );
    throw new CustomError(
      'You need to provide all the data',
      HTTP_CONSTANTS.CUSTOM_CODE.GENERAL.BAD_REQUEST,
      HTTP_CONSTANTS.CODE.BAD_REQUEST
    );
  }

  if (password !== confirmPassword) {
    logger.warn(`[${TAG}] Password and confirmation do not match`);
    throw new CustomError(
      'Password and confirmation do not match',
      HTTP_CONSTANTS.CUSTOM_CODE.AUTH.PASSWORD_MISMATCH,
      HTTP_CONSTANTS.CODE.BAD_REQUEST
    );
  }

  if (permission === 'admin') {
    logger.warn(`[${TAG}] Invalid permission level: admin`);
    throw new CustomError(
      'Permission cannot be admin',
      HTTP_CONSTANTS.CUSTOM_CODE.AUTH.PERMISSION_ADMIN,
      HTTP_CONSTANTS.CODE.BAD_REQUEST
    );
  }

  logger.info(`[${TAG}] Registration data validated successfully`);
  return true;
};
/**
 * Validates a user's credentials by checking the username and verifying the password.
 *
 * @param {Object} userData - The user data containing username and password.
 * @param {string} userData.username - The username of the user.
 * @param {string} userData.password - The plain-text password of the user.
 * @throws {CustomError} If the user is not found or the password is invalid.
 * @returns {Promise<Object>} The validated user object.
 */
const validateUser = async (
  userData,
  checkForPassword = true,
  transaction = null
) => {
  logger.debug(`Validating user: ${userData.username}`);

  console.log(models.User);
  const user = await models[MODEL_CONSTANTS.NAME.USER].findOne({
    where: { username: userData.username },
    attributes: [
      'id',
      'username',
      'password_digest',
      'permission',
      'email',
      'createdAt',
      'updatedAt',
    ],
  });

  if (!user) {
    logger.warn(`User not found: ${userData.username}`);
    throw new CustomError(
      'User not found',
      HTTP_CONSTANTS.CUSTOM_CODE.AUTH.USER_NOT_FOUND
    );
  }

  logger.debug(`User found: ${user.username}, verifying password`);
  const isPasswordValid = checkForPassword
    ? await argon2.verify(user.password_digest, userData.password)
    : true;
  if (!isPasswordValid) {
    logger.warn(`Invalid password for user: ${user.username}`);
    throw new CustomError(
      'Invalid credentials',
      HTTP_CONSTANTS.CUSTOM_CODE.AUTH.INVALID_CREDENTIALS
    );
  }

  logger.info(`Password verified successfully for user: ${user.username}`);
  return user;
};

exports.signJwt = (user, res) => {
  const token = jwt.sign(
    { username: user.username, id: user.id, permission: user.permission },
    JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  logger.info(`Access token set in cookie for user: ${user.username}`);

  return token;
};

exports.checkLoggedinStatus = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    logger.warn('No access token found in cookies');
    return res.status(HTTP_CONSTANTS.CODE.UNAUTHORIZED).json({
      message: 'Unauthorized',
      code: HTTP_CONSTANTS.CUSTOM_CODE.AUTH.NO_TOKEN_FOUND,
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error(`Invalid token: ${err.message}`);
      return res.status(HTTP_CONSTANTS.CODE.FORBIDDEN).json({
        message: 'Forbidden',
        code: HTTP_CONSTANTS.CUSTOM_CODE.AUTH.INVALID_TOKEN,
      });
    }

    logger.info(`Token verified successfully for user: ${decoded.username}`);
    return res.status(HTTP_CONSTANTS.CODE.OK).json({
      message: 'User is logged in',
      code: HTTP_CONSTANTS.CODE.OK,
      data: { ...decoded, isAuthenticated: true },
    });
  });
};

exports.logout = (req, res) => {
  res.clearCookie('access_token');
  logger.info('User logged out and access token cleared from cookies');
  return res.status(HTTP_CONSTANTS.CODE.OK).json({
    message: 'Logged out successfully',
    code: HTTP_CONSTANTS.CODE.OK,
  });
};
exports.validateUser = validateUser;
