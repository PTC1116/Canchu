const errorMes = require("../../util/errorMessage");
const friendModel = require("../models/friendModel");

module.exports = {
  friend: (req, res) => {
    res.send(friendModel.friend());
  },
  friendPending: (req, res) => {
    res.send(friendModel.friendPending());
  },
  friendRequest: async (req, res) => {
    try {
      // res.send(friendModel.friendRequest());
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

    // 從 URL 中提取 id
    // 如果成功就回傳收到邀請的人的 id

    // 要禁止對自己發邀請，禁止對已經是朋友的人發邀請，禁止對已經發過邀請的人發邀請
  },
};
