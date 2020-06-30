const { getStatus } = require('mc-server-status');

const serverStatus = async () => {
  try {
    const { players } = await getStatus("127.0.0.1");
    return {
      online: true,
      players: {
        max: players.max,
        online: players.online,
        list: players.sample ?
          players.sample.map(({name}) => name) : []
      }
    }
  } catch (e) {
    if (e.code && e.code === 'ECONNREFUSED') return { online: false }
    throw e;
  }
};

module.exports = {
  serverStatus,
}
