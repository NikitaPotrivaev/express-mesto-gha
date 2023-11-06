// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');

const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { registerUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFound = require('./utils/NotFound');

const regular = /https?:\/\/(www\.)?[-a-zA-z0-9@:%_\\+.~#?&=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&=]*)/;

const app = express();
app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regular),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), registerUser);

app.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка на стороне сервера'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`${PORT} порт подключен`);
});
