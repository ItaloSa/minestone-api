const defaultMsg = () => {
  return {
    message: 'Unknown Error',
    status: 500,
  }
};

const customMsg = (message, status, details={}) => {
  return { message, status, details };
};

module.exports = {
  defaultMsg,
  customMsg
}
