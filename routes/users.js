const userRouter = require('express').Router();
const { validateUserId, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/data-validation');

const {
  getUsers,
  getUserId,
  updateUserData,
  updateAvatar,
  getUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);

userRouter.get('/:userId', validateUserId, getUserId);

userRouter.patch('/me', validateUpdateUser, updateUserData);

userRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = {
  userRouter,
};
