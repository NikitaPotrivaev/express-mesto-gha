const Card = require('../models/card');

const BadRequest = require('../utils/BadRequest'); // 400
const NotFound = require('../utils/NotFound'); // 404
const Forbidden = require('../utils/Forbidden'); // 403

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    res.send(await Card.create({ name, link, owner: req.user._id }));
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные при создании карточки'));
    } else {
      next(error);
    }
  }
};

const deleteCardId = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFound('Отсутствует данная карточка');
    } else if ((req.params.cardId) !== (card.owner)) {
      throw new Forbidden('Запрещено удалять чужую карточку');
    } else {
      const cardId = await Card.findByIdAndDelete(req.params.cardId);
      res.send({ cardId, message: 'Карточка удалена' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequest('Неверный id карточки'));
    } else {
      next(error);
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!like) {
      throw new NotFound('Отсутствует данная карточка');
    } else {
      res.send({ like });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequest('Неверный id карточки'));
    } else {
      next(error);
    }
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const removeLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!removeLike) {
      throw new NotFound('Отсутствует данная карточка');
    } else {
      res.send({ removeLike });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequest('Неверный id'));
    } else {
      next(error);
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  deleteLike,
};
