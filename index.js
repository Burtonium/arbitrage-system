require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('express-async-errors');
const routes = require('./routes');
const production = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8080;
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use('/', routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.code ? err.message : 'Something went wrong',
    error: production ? true : err,
    code: err.code
  });

  next(err);
});

app.listen(port);

console.log(`Listening on ${port}`);

