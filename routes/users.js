const userRouter = require('express').Router();

const {
  getUsers,
  getUserId,
  updateUserData,
  updateAvatar,
  getUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserId);
userRouter.get('/me', getUser);
userRouter.patch('/me', updateUserData);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = {
  userRouter,
};
