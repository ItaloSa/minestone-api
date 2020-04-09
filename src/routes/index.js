
const user = require('./user');

const router = (app) => {

  app.get('/', (req, res) => {
    res.json({ message: 'Hello!' });
  });

  app.use('/users', user);

}

module.exports = router;
