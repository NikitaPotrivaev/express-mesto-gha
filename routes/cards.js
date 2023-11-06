const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regular = /https?:\/\/(www\.)?[-a-zA-z0-9@:%_\\+.~#?&=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&=]*)/;

const {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  deleteLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regular),
  }),
}), createCard);

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCardId);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteLike);

module.exports = {
  cardRouter,
};
