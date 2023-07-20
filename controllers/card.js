const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  if (!name || !link) {
    res.status(400).send({ message: 'Не отправлены данные карточки' });
    return;
  }

  const newCard = new Card({ name, link, owner: ownerId });

  newCard.save()
    .then(() => {
      res.status(200).send(newCard);
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!cardId) {
    res.status(400).send({ message: 'Не передан ID карточки' });
  }

  Card.deleteOne({ _id: cardId })
    .then((data) => {
      if (data.deletedCount !== 0) {
        res.send(data);
        return;
      }

      res.status(404).send({ message: 'Передан ID несуществующий карточки' });
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!cardId) {
    res.status(404).send({ message: 'Не передан ID карточки' });
  }

  if (!userId) {
    res.status(400).send({ message: 'Не передан ID пользователя' });
  }

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Карточки с таким ID не существует' });
        return;
      }

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

const unlikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!cardId) {
    res.status(404).send({ message: 'Не передан ID карточки' });
  }

  if (!userId) {
    res.status(400).send({ message: 'Не передан ID пользователя' });
  }

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Карточки с таким ID не существует' });
        return;
      }

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ name: err.name, message: err.message });
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, unlikeCard,
};
