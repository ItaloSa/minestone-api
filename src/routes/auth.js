const { Router } = require('express');
const router = Router();

const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');

const RequestError = require('../helpers/Errors/RequestError');
const authorize = require('../middlewares/Auth');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new RequestError('Required fields are missing', 400);
    res.json( await authCtrl.login(email, password));
  } catch (err) {
    next(err);
  }
});

router.get('/userinfo', authorize(), async (req, res, next) => {
  try {
    res.json( await userCtrl.get(req.user._id) );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
