const userRouter = require('express').Router();

const {
  getUsers,
  getUserId,
  registerUser,
  updateUserData,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserId);
userRouter.post('/', registerUser);
userRouter.patch('/me', updateUserData);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = {
  userRouter,
};
