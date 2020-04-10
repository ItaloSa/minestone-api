const bcrypt = require('bcrypt');

const User = require('../models/User');
const { escapeStringRegexp, filterObject } = require('../helpers/functions');
const { paginate } = require('../helpers/paginate');

const create = async (data) => {
  const user = User(data);
  user.password = await bcrypt.hash(user.password, 5);
  user.roles.push('profile');
  await user.save();
  user.password = undefined;
  return user;
};

const getAll = ({ page=1, size=10, email='', name='' } = {}) => {
  const options = {
    active: true,
    email: new RegExp(escapeStringRegexp(email), 'ig'),
    name: new RegExp(escapeStringRegexp(name), 'ig')
  };

  const users = User
    .find(options)
    .sort({
      createdAt: -1
    })
    .select('-password')
    .lean();

  return paginate(users, {page, size});
};

const get = (_id) => {
  const options = {
    active: true,
    _id
  };

  return User
    .findOne(options)
    .select('-password')
    .lean();
};

const update = (_id, data) => {
  const options = {
    active: true,
    _id
  };

  const allowedFields = [
    'name', 'picture', 'email', 'password', 'roles'
  ];

  return User
    .findOneAndUpdate(
      options,
      filterObject(data, allowedFields),
      { new: true, useFindAndModify: false }
    )
    .select('-password');
};

const remove = (_id) => {
  const options = {
    active: true,
    _id
  };

  return User
    .findOneAndUpdate(
      options,
      { active: false },
      { new: true, useFindAndModify: false }
    )
    .select('-password');
};

const find = (filters={}) => {
  return User.findOne({...filters, active: true}).lean();
};

const checkPassword = (user, password) => {
  return bcrypt.compare(password, user.password);
};

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
  checkPassword,
  find
}
