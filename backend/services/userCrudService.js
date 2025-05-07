const TAG = 'UserCrudService';
const { Op } = require('sequelize');

/**
 * Creates a Sequelize `where` option for checking if a user with the given username or email already exists.
 *
 * @param {Object} requestBody - The request body containing user data.
 * @returns {Object} A Sequelize `where` condition object for querying the database.
 */
exports.createWhereOptionForCreation = (requestBody) => {
  const { username, email } = requestBody;
  return {
    [Op.or]: [{ username }, { email }],
  };
};
