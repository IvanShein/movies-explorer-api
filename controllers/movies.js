const mongoose = require('mongoose');
const Movies = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const getAllMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id.toString() })
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new NotFoundError('Переданы некорректные данные при добавлении фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovieById = (req, res, next) => {
  const { deletedMovieId } = req.params;
  Movies.findById(deletedMovieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      } else if (req.user._id === movie.owner.toString()) {
        return movie.deleteOne()
          .then(() => res.send({ data: movie }));
      } else {
        throw new ForbiddenError('Нет прав на удаление фильма, добавленного другим пользователем');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Фильм с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllMovies, createMovie, deleteMovieById,
};
