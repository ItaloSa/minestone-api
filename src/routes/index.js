const account = require('../controllers/account');
const status = require('../controllers/status');

const { SITE_URL } = process.env;

const router = (app) => {

  app.get('/', (_, res) => {
    res.json({ message: 'Hello!' });
  });

  app.post('/account/register', async (req, res, next) => {
    try {
      res.json(await account.register(req.body));
    } catch (err) {
      next(err);
    }
  });

  app.get('/account/verify/:token', async (req, res, next) => {
    try {
      await account.confirmAccount(req.params.token);
      res.redirect(301, SITE_URL);
    } catch (err) {
      next(err);
    }
  });

  app.get('/status', async (_, res, next) => {
    try {
      res.json(await status.serverStatus());
    } catch (err) {
      next(err);
    }
  });

}

module.exports = router;
