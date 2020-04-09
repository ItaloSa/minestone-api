const RequestError = require('../helpers/Errors/RequestError');
const AuthCtrl = require('../controllers/auth');

module.exports = (role) =>
  async (req, _, next) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) throw new RequestError('Must have an authorization', 400);
      const user = await AuthCtrl.checkCredentials(authorization, role);
      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };
