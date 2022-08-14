const router = require('express').Router();

const {
  createUser, getUsers, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/users', getUsers);

// возвращает пользователя по _id
router.get('/users/:userId', getUserById);

// создаёт пользователя
router.post('/users', createUser);

// обновляет профиль
router.patch('/users/me', updateUser);

// обновляет аватар
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
