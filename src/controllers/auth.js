const jsonwebtoken = require('jsonwebtoken');
const userCrtl = require('./user');
const AuthError = require('../helpers/Errors/AuthError');
const { AUTH } = require('../helpers/constants');
const { SECRET } = process.env;

const login = async (email, password) => {
  const user = await userCrtl.find({email});
  if (!user) throw new AuthError(AUTH.NOT_FOUND_MATCH, 400);
  const passwordMatch = await userCrtl.checkPassword(user, password);
  if (!passwordMatch) throw new AuthError(AUTH.NOT_FOUND_MATCH, 400);
  const accessToken = await createToken(user);
  return { user: `${user._id}`, accessToken, roles: user.roles.join(',')  };
};

const createToken = (user) => {
  return jsonwebtoken.sign({
    roles: user.roles.join(',')
  },
  SECRET,
  {
    subject: `${user._id}`,
    expiresIn: '30d'
  });
};

module.exports = {
  login
};
