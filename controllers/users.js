const User = require('../models/user');
const NotFound = require('../errors/error');
const {
  ErrorValidation, ErrorNotFound, ErrorDefault,
} = require('../errors/state');

// получение пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ErrorDefault).send({ message: 'Internal Server Error' }));
};

// получение пользователя по его id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ErrorNotFound).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else if (err.name === 'CastError') {
        res.status(ErrorValidation).send({
          message: 'Задан не некорректный id.',
        });
      } else {
        res.status(ErrorDefault).send({ message: 'Internal Server Error' });
      }
    });
};

// создание нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({
      user,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorValidation).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(ErrorDefault).send({ message: 'Internal Server Error' });
      }
    });
};

// обновление информации о пользователе
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorValidation).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        res.status(ErrorDefault).send({ message: 'Internal Server Error' });
      }
    });
};

// обновление аватара пользователя
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(ErrorNotFound).send({
          message: 'Пользователь с указанным _id не найден',
        });
      } else if (err.name === 'ValidationError') {
        res.status(ErrorValidation).send({
          message: 'Переданы некорректные данные при обновлении аватара. Введите ссылку',
        });
      } else {
        res.status(ErrorDefault).send({ message: 'Internal Server Error' });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
