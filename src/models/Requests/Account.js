const yup = require('yup');

const Login = yup.object().shape({
  email: yup.string('email must be a string').required('email is required'),
  password: yup.string('password must be a string').required('password is required'),
});

const Register = yup.object().shape({
  name: yup.string().required('name is required'),
  email: yup.string().required('email is required'),
  phoneNumber: yup.string(),
  password: yup.string().required('password is required'),
  picture: yup.string().url('picture must be a valid url')
});

const ResetPassoword = yup.object().shape({
  password: yup.string().required('password is required'),
  token: yup.string().required('token is required'),
});

const ResetPassowordRequest = yup.object().shape({
  email: yup.string().required('email is required'),
});

const VerifyAccount = yup.object().shape({
  token: yup.string().required('token is required'),
});

module.exports = {
  Login,
  Register,
  ResetPassoword,
  VerifyAccount,
  ResetPassowordRequest
};
