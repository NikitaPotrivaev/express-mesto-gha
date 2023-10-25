const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
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

const registerUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = new User({ name, about, avatar });
    res.send(await newUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации полей', ...error });
    } else {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
  }
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

module.exports = {
  getUsers,
  getUserId,
  registerUser,
  updateUserData,
  updateAvatar,
};
