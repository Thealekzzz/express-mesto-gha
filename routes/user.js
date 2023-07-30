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
  getUserByIdValidation,
} = require('../middlewares/validations/user');

userRouter.get('/me', auth, getMe);
userRouter.get('/:userId', getUserByIdValidation, auth, getUserById);
userRouter.get('/', auth, getUsers);

userRouter.patch('/me', auth, updateUser);
userRouter.patch('/me/avatar', auth, updateAvatar);

module.exports = userRouter;
