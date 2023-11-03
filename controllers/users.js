const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = User.find(req.user._id);
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.send({ user });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Отсутствует пользователь с таким id' });
    } else {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

const getUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.send({ user });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Отсутствует пользователь с таким id' });
    } else {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

const registerUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const passwordHash = bcrypt.hash(password, 10);
  passwordHash.then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then(() => res.send({
      name, about, avatar, email,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации полей', ...error });
      } else if (error.code === 11000) {
        res.status(409).send({ message: 'Пользователь уже существует' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

const updateUserData = async (req, res) => {
  try {
    const { name, about } = req.body;
    const update = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send({ update });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации полей', ...error });
    } else {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send({ userAvatar });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации полей', ...error });
    } else {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      res.status(401).send({ message: 'Неверные почта или пароль' });
    } else {
      const token = jwt.sign({ _id: user._id }, 'token-generate-key', { expiresIn: '7d' });
      res.send({ token, email: user.email });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации полей', ...error });
    } else {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserId,
  registerUser,
  updateUserData,
  updateAvatar,
  login,
};
