const fs = require('fs');

const Rcon = require('../config/rcon');
const Database = require('../config/database');
const Email = require('../services/email');

const CustomError = require('../helpers/Errors/CustomError');

const { SERVICE_URL, EMAIL_USER } = process.env;

const register = async (data) => {
  try {
    const db = Database.instance();
    const users = db.get('users');

    const existsUser = users
      .find({ userName: data.userName, verified: true })
      .value();
    const existsEmail = users
      .find({ email: data.email, verified: true })
      .value();

    if (existsUser) {
      throw new CustomError('USER_IN_USE', 200);
    } else if (existsEmail) {
      throw new CustomError('EMAIL_IN_USE', 200);
    }

    const lastId = users
      .size()
      .value();
    const now = new Date();

    const newUser = {
      ...data,
      id: lastId + 1,
      createdAt: now.toISOString(),
      verified: false
    };

    let verifToken = {
      uid: newUser.id,
      exp: new Date(now.getTime() + 2 * 3600000).toISOString()
    };

    newUser.token = Buffer.from(JSON.stringify(verifToken)).toString('base64');

    const template = fs.readFileSync(
      `${__dirname}/../services/email/templates/main.html`, 'utf-8'
    );
    await Email.send(template, {
      from: `"MineStone" <${EMAIL_USER}>`,
      to: newUser.email,
      subject: 'MineStone - Confirm your account'
    }, {
      player: newUser.userName,
      link: `${SERVICE_URL}/account/verify/${newUser.token}`
    });

    users.push(newUser).write();
    return newUser;

  } catch (err) {
    throw err;
  }
};

const confirmAccount = async (token) => {
  try {

    const db = Database.instance();
    const users = db.get('users');

    const user = users
      .find({ token: token })
      .value();
    console.log(token, user)
    if (!user) {
      return;
    }

    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (new Date() > new Date(payload.exp)) { return; }

    users
      .find({ id: user.id })
      .assign({ verified: true })
      .write()

    const rcon = await Rcon.instance();
    const response = await rcon.send(`whitelist add ${user.userName}`);
    console.log('account - rcon response >>', response);

    if (!response.includes('already') || response.includes('Added')) {
      throw new CustomError('RCON_ERR', 500);
    }

    return;

  } catch (err) {
    throw err;
  }
};

module.exports = {
  register,
  confirmAccount
};
