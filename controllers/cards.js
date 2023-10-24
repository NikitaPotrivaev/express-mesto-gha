const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (error) {
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    res.send(await Card.create({ name, link, owner: req.user._id }));
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const deleteCardId = async (req, res) => {
  try {
    const cardId = await Card.findByIdAndDelete(req.params.cardId);
    if (!cardId) {
      res.status(404).send({ message: 'Отсутствует данная карточка' });
    }
    res.send({ cardId });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Неверный id' });
    }
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const likeCard = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!like) {
      res.status(404).send({ message: 'Отсутствует данная карточка' });
    }
    res.send({ like });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Неверный id' });
    }
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const deleteLike = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislike) {
      res.status(404).send({ message: 'Отсутствует данная карточка' });
    }
    res.send({ dislike });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'Неверные данные' });
    }
    res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  deleteLike,
};