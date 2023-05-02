const { celebrate, Joi } = require('celebrate');
const REGEXP_URL = require('../utils/constants');

module.exports.isValidLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.isValidCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.isValidCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REGEXP_URL),
    trailerLink: Joi.string().required().pattern(REGEXP_URL),
    thumbnail: Joi.string().required().pattern(REGEXP_URL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.isValidMovieId = celebrate({
  params: Joi.object().keys({
    deletedMovieId: Joi.string().required().hex().length(24),
  }),
});

module.exports.isValidUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});
