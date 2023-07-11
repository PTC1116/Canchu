const errorMes = require("../../util/errorMessage");
const friendUtil = require("../../util/friendUtil");
const friendModel = require("../models/friendModel");

module.exports = {
  friend: (req, res) => {
    res.send(friendModel.friend());
  },
  pending: async (req, res) => {
    try {
      // 回傳：所有寄了交友邀請給我的人
      const id = req.userData.id;
      const searchForRequester = await friendModel.friendPending(id);
      const users = friendUtil.generateUserSearchObj(searchForRequester);
      const successObj = { data: { users } };
      return res.status(200).send(successObj);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
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
      const result = await friendModel.friendRequest(requesterId, receiverId);
      const successRes = {
        data: {
          friendship: {
            id: result.ID,
          },
        },
      };
      return res.status(200).send(successRes);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
  agree: async (req, res) => {
    try {
      const userId = req.userData.id;
      const friendshipId = req.params.friendship_id;
      const result = await friendModel.friendAgree(userId, friendshipId);
      const successObj = {
        data: {
          friendship: {
            id: result,
          },
        },
      };
      return res.status(200).send(successObj);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
  delete: async (req, res) => {
    try {
      const friendshipId = req.params.friendship_id;
      const userId = req.userData.id;
      const result = await friendModel.delete(userId, friendshipId);
      const successObj = { data: { friendship: { id: result } } };
      return res.status(200).send(successObj);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
};
