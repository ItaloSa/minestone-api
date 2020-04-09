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

const checkCredentials = async (authorization, role) => {
  const [ type, token ] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') throw new AuthError('Authorization must be the bearer type', 403);
  const payload = await jsonwebtoken.verify(token, SECRET);
  if (!payload) throw new AuthError('Must have a valid authorization', 403);
  const user = await userCrtl.find({_id: payload.sub});
  if (!user) throw new AuthError('Invalid user', 401);
  if (role && !user.roles.includes(role)) {
    throw new AuthError('Access Denied', 401);
  }
  return user;
};

module.exports = {
  login,
  checkCredentials
};
