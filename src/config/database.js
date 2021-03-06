const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

module.exports = {
  dbInstance: null,
  instance() {
    if (!this.dbInstance) {
      const adapter = new FileSync(`${__dirname}/../../db.json`);
      this.dbInstance = low(adapter);
    }
    return this.dbInstance;
  },
  setup() {
    console.log('>> db setup');
    const db = this.instance();
    db.defaults({ users: [] })
      .write()
  }
};
