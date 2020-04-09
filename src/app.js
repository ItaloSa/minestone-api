const express = require('express');
const cors = require('cors');

const app = express();

const database = require('./config/database');
const routes = require('./routes');
const HandleErrors = require('./middlewares/HandleErrors');

database.setup();

app.use(cors());
app.use(express.json());
routes(app);
app.use(HandleErrors);

module.exports = app;
