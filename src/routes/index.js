const account = require('../controllers/account');

const router = (app) => {

  app.get('/', (req, res) => {
    res.json({ message: 'Hello!' });
  });

  app.post('/account/register', async (req, res, next) => {
    try {
      res.json(await account.register(req.body));
    } catch (err) {
      next(err);
    }
  });

}

module.exports = router;
