
const user = require('./user');
const account = require('./account');

const router = (app) => {

  app.get('/', (req, res) => {
    res.json({ message: 'Hello!' });
  });

  app.use('/users', user);
  app.use('/account', account);

}

module.exports = router;
