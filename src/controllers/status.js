const { getStatus } = require('mc-server-status');

const serverStatus = () => {
  try {
    return getStatus("127.0.0.1");
  } catch (e) {
    throw e;
  }
};

module.exports = {
  serverStatus,
}
