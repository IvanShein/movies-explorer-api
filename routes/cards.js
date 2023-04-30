const router = require('express').Router();
const {
  getAllCards, createCard, deleteCardById, putCardLike, deleteCardLike,
} = require('../controllers/cards');
const { isValidCreateCard, isValidCardId } = require('../middlewares/req-validation');

router.get('/', getAllCards);
router.post('/', isValidCreateCard, createCard);
router.delete('/:cardId', isValidCardId, deleteCardById);
router.put('/:cardId/likes', isValidCardId, putCardLike);
router.delete('/:cardId/likes', isValidCardId, deleteCardLike);

module.exports = router;
