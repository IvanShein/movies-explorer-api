const router = require('express').Router();
const {
  getAllMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');
const { isValidCreateMovie, isValidMovieId } = require('../middlewares/req-validation');

router.get('/', getAllMovies);
router.post('/', isValidCreateMovie, createMovie);
router.delete('/:deletedMovieId', isValidMovieId, deleteMovieById);

module.exports = router;
