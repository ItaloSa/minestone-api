const { Router } = require('express');
const router = Router();

const authCtrl = require('../controllers/auth');
const RequestError = require('../helpers/Errors/RequestError');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new RequestError('Required fields are missing', 400);
    res.json( await authCtrl.login(email, password));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
