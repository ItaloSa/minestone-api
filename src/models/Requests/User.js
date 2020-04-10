const yup = require('yup');

module.exports = yup.object().shape({
  name: yup.string().required('name is required'),
  email: yup.string().required('email is required'),
  password: yup.string().required('password is required'),
  picture: yup.string().url('picture must be a valid url'),
  roles: yup.array().of(yup.string()).strict().typeError('roles must be an array of strings'),
});
