const friendModel = require("../models/friendModel");

module.exports = {
  friend: (req, res) => {
    res.send(friendModel.friend());
  },
  friendPending: (req, res) => {
    res.send(friendModel.friendPending());
  },
  friendRequest: (req, res) => {
    res.send(friendModel.friendRequest());
  },
};
