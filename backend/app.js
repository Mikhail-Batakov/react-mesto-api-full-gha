require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const cors = require('cors');
const { default: rateLimit } = require('express-rate-limit');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env; // поправить

mongoose.connect(DB_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const app = express();

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение слушает порт: ${PORT}`);
});
