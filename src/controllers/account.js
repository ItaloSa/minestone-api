const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');

const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');
const mailService = require('../services/mail');
const CustomErros = require('../helpers/Errors/CustomError');
const { filterObject } = require('../helpers/functions');
const { ACCOUNT } = require('../helpers/constants');

const {
  HOME_PAGE_URL,
  SIGNING_KEY,
  EMAIL_USER
} = process.env;

const login = ({ email, password }) => authCtrl.login(email, password);

const profile = ({ _id }) => userCtrl.get(_id);

const register = async (data) => {
  try {
    const user = await userCtrl.create(data);
    await verificationEmail(user);
    return user;
  } catch (err) {
    throw err;
  }
};

const genVerifToken = ({ payload, expiresIn = '1d' } = {}) => {
  return jsonwebtoken.sign(
    payload,
    SIGNING_KEY,
    { expiresIn }
  );
};

const verificationEmail = async (user) => {
  try {
    const token = genVerifToken({ payload: { user: user._id }, expiresIn: '1d' });
    const template = fs.readFileSync(
      `${__dirname}/../services/mail/templates/newAccount.html`, 'utf-8'
    );
    const mail = {
      from: `"Base Service" <${EMAIL_USER}>`,
      to: user.email,
      subject: 'Verify your account'
    };
    const variables = {
      preheader: 'Wellcome to base service',
      userName: user.name.split(' ')[0],
      verifyUrl: `${HOME_PAGE_URL}/account/verify/${token}`,
      websiteUrl: HOME_PAGE_URL,
    };
    await mailService.send(template, mail, variables);
  } catch (err) {
    throw err;
  }
};

const verifyAccount = async ({ token }) => {
  try {
    const payload = jsonwebtoken.verify(token, SIGNING_KEY);
    await userCtrl.update(payload.user, { verified: true });
    return { message: 'Account verified' };
  } catch (_) {
    throw new CustomErros(ACCOUNT.INVALID_VERIFICATION_CODE);
  }
};

const update = (user, data) => {
  const allowedFields = [
    'name', 'picture', 'email', 'password'
  ];
  return userCtrl.update(user._id, filterObject(data, allowedFields));
};

const resetPasswordRequest = async ({ email }) => {
  try {
    const message = { message: 'Check your email' };
    const user = await userCtrl.find({ email });
    if (!user) return message;
    await resetPasswordEmail(user);
    return message;
  } catch (err) {
    throw err;
  }
};

const resetPasswordEmail = async (user) => {
  try {
    const token = genVerifToken({ payload: { user: user._id }, expiresIn: '1h' });
    const template = fs.readFileSync(
      `${__dirname}/../services/mail/templates/resetPassword.html`, 'utf-8'
    );
    const mail = {
      from: `"Base Service" <${EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset your password'
    };
    const variables = {
      preheader: 'You requested a password reset',
      userName: user.name.split(' ')[0],
      resetPassUrl: `${HOME_PAGE_URL}/account/reset/${token}`,
      websiteUrl: HOME_PAGE_URL,
    };
    await mailService.send(template, mail, variables);
  } catch (err) {
    throw err;
  }
};

const resetPassword = async ({ token, password }) => {
  try {
    const payload = jsonwebtoken.verify(token, SIGNING_KEY);
    await userCtrl.update(payload.user, { password });
    return { message: 'Password changed' };
  } catch (_) {
    throw new CustomErros(ACCOUNT.INVALID_RESET_PASSWORD_CODE);
  }
};

module.exports = {
  login,
  register,
  profile,
  verifyAccount,
  update,
  resetPasswordRequest,
  resetPassword
};
