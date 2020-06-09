const nodemailer = require('nodemailer');

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS
} = process.env;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const fillTemplate = (template = '', vars = {}) => {
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`{\{${key}\}}`, 'ig');
    template = template.replace(regex, value);
  });
  return template;
};

const send = (
  template,
  {
    from,
    to,
    subject
  } = {},
  vars = {}
) => {
  const html = fillTemplate(template, vars);
  return transporter.sendMail({
    from,
    to,
    subject,
    html
  });
};

module.exports = {
  send
};
