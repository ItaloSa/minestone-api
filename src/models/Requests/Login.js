const yup = require('yup');

module.exports = yup.object().shape({
  email: yup.string('email must be a string').required('email is required'),
  password: yup.string('password must be a string').required('password is required'),
});
