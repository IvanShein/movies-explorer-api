require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      Users.create({
        name, email, password: hash,
      })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
          } else if (err instanceof mongoose.Error.ValidationError) {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          } else {
            next(err);
          }
        });
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser, updateUser, login, getCurrentUser,
};
