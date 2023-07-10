const errorMes = require("../../util/errorMessage");
const friendUtil = require("../../util/friendUtil");
const friendModel = require("../models/friendModel");

module.exports = {
  friend: (req, res) => {
    res.send(friendModel.friend());
  },
  friendPending: async (req, res) => {
    // 回傳：所有寄了交友邀請給我的人
    const id = req.userData.id;
    const searchForRequester = await friendModel.friendPending(id);
    const users = friendUtil.generateUserSearchObj(searchForRequester);
    const successObj = { data: { users } };
    return res.status(200).send(successObj);
  },
  friendRequest: async (req, res) => {
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
};
