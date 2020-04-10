const { Router } = require('express');
const router = Router();

const accountRequests = require('../models/Requests/Account');
const accountCtrl = require('../controllers/account');
const authorize = require('../middlewares/Auth');

router.post('/login', async (req, res, next) => {
  try {
    const data = await accountRequests.Login.validate(req.body);
    res.json(await accountCtrl.login(data));
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    let data = await accountRequests.Register.validate(req.body);
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

router.post('/verify', async (req, res, next) => {
  try {
    let data = await accountRequests.VerifyAccount.validate(req.body);
    res.json(await accountCtrl.verifyAccount(data));
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password/request', async (req, res, next) => {
  try {
    let data = await accountRequests.ResetPassowordRequest.validate(req.body);
    res.json(await accountCtrl.resetPasswordRequest(data));
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    let data = await accountRequests.ResetPassoword.validate(req.body);
    res.json(await accountCtrl.resetPassword(data));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
