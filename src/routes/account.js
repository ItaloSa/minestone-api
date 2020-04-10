const { Router } = require('express');
const router = Router();

const LoginRequest = require('../models/Requests/Login');
const RegisterRequest = require('../models/Requests/Register');

const accountCtrl = require('../controllers/account');
const authorize = require('../middlewares/Auth');

router.post('/login', async (req, res, next) => {
  try {
    const data = await LoginRequest.validate(req.body);
    res.json(await accountCtrl.login(data));
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    let data = await RegisterRequest.validate(req.body);
    res.json(await accountCtrl.register(data));
  } catch (err) {
    next(err);
  }
});

router.get('/', authorize(), async (req, res, next) => {
  try {
    res.json(await accountCtrl.profile(req.user));
  } catch (err) {
    next(err);
  }
});

router.patch('/', authorize(), async (req, res, next) => {
  try {
    res.json(await accountCtrl.update(req.user, req.body));
  } catch (err) {
    next(err);
  }
});

router.get('/verify/:token', async (req, res, next) => {
  try {
    res.json(await accountCtrl.verifyAccount(req.params.token));
  } catch (err) {
    next(err);
  }
});


module.exports = router;
