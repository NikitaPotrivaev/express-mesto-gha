const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  deleteLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCardId);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', deleteLike);

module.exports = {
  cardRouter,
};
