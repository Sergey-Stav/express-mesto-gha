const Card = require('../models/card');
const NotFound = require('../errors/error');
const {
  ErrorValidation, ErrorNotFound, ErrorDefault,
} = require('../errors/state');

// Получение всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(ErrorDefault).send({ message: 'Internal Server Error' });
    });
};

// Создание новой карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ErrorValidation).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(ErrorDefault).send({ message: 'Internal Server Error' });
      }
    });
};

// Удаление карточки
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorValidation).send({
          message: 'Переданы некорректные данные.',
        });
      } else if (err.name === 'NotFound') {
        res.status(ErrorNotFound).send({
          message: 'Карточка с указанным id не найдена',
        });
      } else {
        res.status(ErrorDefault).send({ message: 'Internal Server Error' });
      }
    });
};

// Поставить лайк
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorValidation).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } else if (err.name === 'NotFound') {
        res.status(ErrorNotFound).send({
          message: 'Передан несуществующий id карточки',
        });
      } else {
        res.status(ErrorDefault).send({ message: 'Internal Server Error' });
      }
    });
};

// Удалить лайк
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ErrorValidation).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      } else if (err.name === 'NotFound') {
        res.status(ErrorNotFound).send({
          message: 'Передан несуществующий id карточки.',
        });
      } else {
        res.status(ErrorDefault).send({ message: 'Internal Server Error' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};