const Chat = require('../models/chat');

function find(req, res, next) {
  Chat
    .find({ participants: req.currentUser.id })
    .populate('participants messages.createdBy')
    .then(chats => res.status(200).json(chats))
    .catch(next);
}

function show(req, res, next) {
  Chat
    .findById(req.params.id)
    .then(chat => {
      if (!chat) return res.notFound();
      return res.status(200).json(chat);
    })
    .catch(next);
}

function create(req, res, next) {
  req.body.participants = [req.currentUser.id, req.params.id];

  Chat
    .create(req.body)
    .then(chat => res.status(201).json(chat))
    .catch(next);
}

function remove(req, res, next) {
  Chat
    .findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(200))
    .catch(next);
}

module.exports = {
  find,
  show,
  create,
  remove
}