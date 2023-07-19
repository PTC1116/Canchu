const errorMes = require('../../util/errorMessage');
const friendUtil = require('../../util/friendUtil');
const friendModel = require('../models/friendModel');
const eventModel = require('../models/eventModel');
module.exports = {
  showAllFriends: async (req, res) => {
    try {
      const id = req.userData.id;
      const result = await friendModel.showAllFriends(id);
      const users = friendUtil.generateUserSearchObj(result, 'friend');
      const successObj = { data: { users } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  pending: async (req, res) => {
    try {
      const id = req.userData.id;
      const searchForRequester = await friendModel.pending(id);
      const users = friendUtil.generateUserSearchObj(
        searchForRequester,
        'pending',
      );
      const successObj = { data: { users } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  request: async (req, res) => {
    try {
      const receiverId = req.params.user_id * 1;
      const requesterId = req.userData.id;
      // prevent users from sending friend request to themselves
      if (receiverId === requesterId) {
        throw errorMes.clientError;
      }
      const id = await friendModel.request(requesterId, receiverId);
      // send notification
      const eventType = 'friend_request';
      const text = '邀請你成為好友';
      await eventModel.send(eventType, text, requesterId, receiverId);
      const successRes = {
        data: {
          friendship: {
            id,
          },
        },
      };
      return res.status(200).send(successRes);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  agree: async (req, res) => {
    try {
      const userId = req.userData.id;
      const friendshipId = req.params.friendship_id * 1;
      const id = await friendModel.agree(userId, friendshipId);
      // send notification
      // find notification receiverId with friendshipId (which equal to the requesterId in the friends table)
      const notifReceiverId = await friendModel.findRequesterByFriendshipId(
        friendshipId,
      );
      const eventType = 'friend_request';
      const text = '接受了你的好友邀請';
      await eventModel.send(eventType, text, userId, notifReceiverId);
      const successObj = {
        data: {
          friendship: {
            id,
          },
        },
      };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  delete: async (req, res) => {
    try {
      const friendshipId = req.params.friendship_id * 1;
      const userId = req.userData.id;
      const id = await friendModel.delete(userId, friendshipId);
      const successObj = { data: { friendship: { id } } };
      return res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
};
