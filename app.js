require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { router } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(cors());

mongoose
  .connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => {
    console.log('Connected with DB');
  })
  .catch((error) => {
    console.log(`Error during connection with DB ${error}`);
  });

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? `На сервере произошла ошибка: ${message}`
        : message,
    });
  next();
});

app.listen(PORT);
