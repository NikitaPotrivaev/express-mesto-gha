const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regular = /https?:\/\/(www\.)?[-a-zA-z0-9@:%_\\+.~#?&=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&=]*)/;

const {
  getUsers,
  getUserId,
  updateUserData,
  updateAvatar,
  getUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserData);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regular),
  }),
}), updateAvatar);

module.exports = {
  userRouter,
};
