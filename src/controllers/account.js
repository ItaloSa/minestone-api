const Rcon = require('../config/rcon');
const Database = require('../config/database');
const CustomError = require('../helpers/Errors/CustomError');

const register = async (data) => {
  try {
    const db = Database.instance();
    const users = db.get('users');

    const existsUser = users
      .find({ userName: data.userName })
      .value();
    const existsEmail = users
      .find({ email: data.email })
      .value();

    if (existsUser) {
      throw new CustomError('USER_IN_USE', 200);
    } else if (existsEmail) {
      throw new CustomError('EMAIL_IN_USE', 200);
    }

    const lastId = users.value().length;
    const now = new Date().toISOString();
    const newUser = {
      ...data,
      id: lastId + 1,
      createdAt: now,
      updatedAt: now,
    };

    const rcon = await Rcon.instance();
    const response = await rcon.send(`whitelist add ${newUser.userName}`);

    if (response.includes('already')) {
      throw new CustomError('USER_EXITS', 200);
    } else if (response.includes('Added')) {
      users.push(newUser).write();
      return newUser;
    } else {
      throw new CustomError('RCON_ERR', 500);
    }

  } catch (err) {
    throw err;
  }
};

module.exports = {
  register
};
