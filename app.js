const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '6537b09bd846781f8334c35e',
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log(`${PORT} порт подключен`);
});
