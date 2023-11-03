const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { registerUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.post('/signin', login);
app.post('/signup', registerUser);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`${PORT} порт подключен`);
});
