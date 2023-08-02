const userRouter = require('express').Router();

const auth = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/user');
const {
  getUserByIdValidation, updateAvatarValidation, updateUserValidation,
} = require('../middlewares/validations/user');

userRouter.get('/me', auth, getMe);
userRouter.get('/:userId', auth, getUserByIdValidation, getUserById);
userRouter.get('/', auth, getUsers);

userRouter.patch('/me', auth, updateUserValidation, updateUser);
userRouter.patch('/me/avatar', auth, updateAvatarValidation, updateAvatar);

module.exports = userRouter;
