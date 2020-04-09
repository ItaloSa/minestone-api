const ErrorResponse = require('../helpers/ErrorResponse');
const CrudErrors = require('../helpers/CrudErrors');

const { NODE_ENV } = process.env;

const knownErrors = {
  MongoError: CrudErrors,
  ValidationError: CrudErrors
};

module.exports = (err, _, res, next) => {
  if (NODE_ENV !== 'production') {
    console.log('>> Debug:', err);
  }

  const knownError = knownErrors[err.name];
  if (knownError) {
    const { status, message, details } = knownError(err);
    res.status(status).json({ message, details });
  } else {
    const { status, message, details } = ErrorResponse.defaultMsg();
    res.status(status).json({ message, details });
  }

  next();
}
