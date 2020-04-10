const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');

const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');
const mailService = require('../services/mail');
const CustomErros = require('../helpers/Errors/CustomError');
const { filterObject } = require('../helpers/functions');

const {
  BASE_URL,
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

const verificationEmail = async (user) => {
  try {
    const token = jsonwebtoken.sign(
      { user: user._id },
      SIGNING_KEY,
      { expiresIn: '1d' }
    );
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
      verifyUrl: `${BASE_URL}/account/verify/${token}`,
      websiteUrl: HOME_PAGE_URL,
    };
    await mailService.send(template, mail, variables);
  } catch (err) {
    throw err;
  }
};

const verifyAccount = async (token) => {
  try {
    const payload = jsonwebtoken.verify(token, SIGNING_KEY);
    await userCtrl.update(payload.user, { verified: true });
    return { message: 'Account verified' };
  } catch (_) {
    throw new CustomErros('Invalid verification code', 400);
  }
};

const update = (user, data) => {
  const allowedFields = [
    'name', 'picture', 'email', 'password'
  ];
  return userCtrl.update(user._id, filterObject(data, allowedFields));
};

module.exports = {
  login,
  register,
  profile,
  verifyAccount,
  update
};
