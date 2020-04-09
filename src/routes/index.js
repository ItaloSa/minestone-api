
const user = require('./user');
const auth = require('./auth');

const router = (app) => {

  app.get('/', (req, res) => {
    res.json({ message: 'Hello!' });
  });

  app.use('/users', user);
  app.use('/auth', auth);

}

module.exports = router;
