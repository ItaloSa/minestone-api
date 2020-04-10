const { Router } = require('express');
const router = Router();

const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');
const LoginRequest = require('../models/Requests/Login');
const RegisterRequest = require('../models/Requests/Register');

const authorize = require('../middlewares/Auth');

router.post('/login', async (req, res, next) => {
  try {
    const login = await LoginRequest.validate(req.body);
    const { email, password } = login;
    res.json(await authCtrl.login(email, password));
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    let data = await RegisterRequest.validate(req.body);
    res.json(await userCtrl.create(data));
  } catch (err) {
    next(err);
  }
});

router.get('/', authorize(), async (req, res, next) => {
  try {
    res.json(await userCtrl.get(req.user._id));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
