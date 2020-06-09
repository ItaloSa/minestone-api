const RequestError = require('../helpers/Errors/RequestError');
const AuthCtrl = require('../controllers/auth');
const { AUTH } = require('../helpers/constants');

module.exports = (role) =>
  async (req, _, next) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) throw new RequestError(AUTH.AUTHORIZATION_REQUIRED, 400);
      req.user = null;
      next();
    } catch (err) {
      next(err);
    }
  };
