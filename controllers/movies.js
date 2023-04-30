const mongoose = require('mongoose');
const Movies = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const getAllCards = (req, res, next) => {
  Cards.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new NotFoundError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else if (req.user._id === card.owner.toString()) {
        return card.deleteOne()
          .then(() => res.send({ data: card }));
      } else {
        throw new ForbiddenError('Нет прав на удаление карточки, созданой другим пользователем');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

const putCardLike = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError('Передан несуществующий_id карточки');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

const deleteCardLike = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        throw new NotFoundError('Передан несуществующий_id карточки');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCardById, putCardLike, deleteCardLike,
};
