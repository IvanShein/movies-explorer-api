const router = require('express').Router();
const { updateUser, getCurrentUser } = require('../controllers/users');
const { isValidUpdateUser } = require('../middlewares/req-validation');

router.get('/me', getCurrentUser);
router.patch('/me', isValidUpdateUser, updateUser);

module.exports = router;
