const cardRouter = require('express').Router();
const { validateCreateCard, validateCardId } = require('../middlewares/data-validation');

const {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  deleteLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', validateCreateCard, createCard);

cardRouter.delete('/:cardId', validateCardId, deleteCardId);

cardRouter.put('/:cardId/likes', validateCardId, likeCard);

cardRouter.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = {
  cardRouter,
};
