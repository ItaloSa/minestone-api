const { Router } = require('express');
const router = Router();

const userCtrl = require('../controllers/user');

router.post('/', async (req, res, next) => {
  try {
    res.json( await userCtrl.create(req.body));
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    res.json( await userCtrl.getAll(req.query) );
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json( await userCtrl.get(req.params.id) );
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    res.json( await userCtrl.update(req.params.id, req.body) );
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    res.json( await userCtrl.remove(req.params.id) );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
