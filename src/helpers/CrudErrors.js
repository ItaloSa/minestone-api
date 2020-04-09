const ErrorResponse = require('./ErrorResponse');

const handleMongoErrors = (error) => {
  let response = ErrorResponse.defaultMsg();
  switch(error.code) {
    case 11000:
      response = ErrorResponse.customMsg('Duplicate item', 409);
      break;
    default:
      break;
  }
  return response;
};

const handleValidationErrors = (error) => {
  const invalidFieldsNames = Object.getOwnPropertyNames(error.errors);
  const invalidFields = invalidFieldsNames.reduce(
    (prev, field) => ({...prev, [field]: error.errors[field].properties}),
    {}
  );
  return ErrorResponse.customMsg('Invalid request body', 400, invalidFields)
};

const handleErrors = (error) => {
  switch(error.name) {
    case 'MongoError':
      return handleMongoErrors(error);
    case 'ValidationError':
      return handleValidationErrors(error);
    default:
      break;
  }
};

module.exports = handleErrors;
