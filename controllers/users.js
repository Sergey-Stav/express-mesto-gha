const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFound = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const { getJwtToken } = require('../utils/jwt');

// получение пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// получение пользователя по его id
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Задан не некорректный id.'));
      } else {
        next(err);
      }
    });
};

// получение информации о текущем пользователе
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    if (!user) {
      return next(new NotFound('Пользователь не найден.'));
    }
    return res.status(200).send(user);
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id'));
    } else {
      next(err);
    }
  });
};

// создание нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      // eslint-disable-next-line no-underscore-dangle
      const newUser = { ...user._doc };
      delete newUser.password;
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// логин пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = getJwtToken(user.id);
      return res.send({ token });
    })
    .catch(next);
};

// обновление информации о пользователе
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound('Пользователь по указанному _id не найден.');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя.'));
      } else {
        next(err);
      }
    });
};

// обновление аватара пользователя
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound('Пользователь по указанному _id не найден.');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные, введите ссылку'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, getCurrentUser, updateAvatar, login,
};
