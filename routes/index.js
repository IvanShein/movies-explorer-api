const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { isValidLogin, isValidCreateUser } = require('../middlewares/req-validation');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', isValidLogin, login);
router.post('/signup', isValidCreateUser, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('По указаной ссылке страница не найдена'));
});

module.exports = { router };
