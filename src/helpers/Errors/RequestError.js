module.exports = class RequestError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'RequestError';
    this.code = code;
  }
};
