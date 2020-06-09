
const router = (app) => {

  app.get('/', (req, res) => {
    res.json({ message: 'Hello!' });
  });

}

module.exports = router;
