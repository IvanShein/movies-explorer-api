const router = require('express').Router();
const {
  getAllUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');
const { isValidGetUserById, isValidUpdateUser, isValidUpdateAvatar } = require('../middlewares/req-validation');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', isValidGetUserById, getUserById);
router.patch('/me', isValidUpdateUser, updateUser);
router.patch('/me/avatar', isValidUpdateAvatar, updateAvatar);

module.exports = router;
