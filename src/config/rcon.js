const { Rcon } = require('rcon-client');

const { MINE_HOST_URL, MINE_HOST_PASS } = process.env;

module.exports = {
  rconInstance: null,
  async instance() {
    if (!this.rconInstance) {
      rcon = await Rcon.connect({
        host: MINE_HOST_URL, password: MINE_HOST_PASS
      });
      console.log('>> rcon connected');
    }

    return rcon
  }
};
