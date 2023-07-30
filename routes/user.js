const userRouter = require('express').Router();

const auth = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getMe,
} = require('../controllers/user');
const {
  loginValidation,
  createUserValidation,
  getUserByIdValidation,
} = require('../middlewares/validations/user');

userRouter.get('/me', auth, getMe);
userRouter.get('/:userId', getUserByIdValidation, auth, getUserById);
userRouter.get('/', auth, getUsers);

userRouter.post('/signin', loginValidation, login);
userRouter.post('/signup', createUserValidation, createUser);

userRouter.patch('/me', auth, updateUser);
userRouter.patch('/me/avatar', auth, updateAvatar);

module.exports = userRouter;
