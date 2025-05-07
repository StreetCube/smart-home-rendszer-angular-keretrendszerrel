const authorizationMiddleware = require('./authorizationMiddleware');

const conditionalAuthorizationMiddleware = (req, res, next) => {
  if (req.modelContext.name === 'User') {
    return next();
  }

  return authorizationMiddleware(req, res, next);
};

module.exports = conditionalAuthorizationMiddleware;
