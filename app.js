require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFound = require('./errors/notFoundError');
const errorProcessing = require('./errors/errorProcessing');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const options = {
  origin: [
    'http://localhost:3006',
    'http://mestos.students.nomoredomains.sbs',
    'https://mestos.students.nomoredomains.sbs',
    'http://51.250.18.119',
    'https://51.250.18.119',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(w{3}\.)?([\w-]{1,}\.)+[\w._~:/?#[\]@!$&'()*+,;=]*#?/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorProcessing);

app.listen(PORT);
