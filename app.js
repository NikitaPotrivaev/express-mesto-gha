// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { registerUser, login } = require('./controllers/users');
const { validateUserRegister, validateUserLogin } = require('./middlewares/data-validation');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');

const NotFound = require('./utils/NotFound');

const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use(limiter);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.post('/signin', validateUserLogin, login);

app.post('/signup', validateUserRegister, registerUser);

app.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${PORT} порт подключен`);
});
