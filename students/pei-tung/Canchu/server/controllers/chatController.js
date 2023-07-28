const errMsg = require('../../util/errorMessage');
const model = require('../models/chatModels');

module.exports = {
  sendMsg: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        throw errMsg.invaildHeader;
      }
      const myId = req.userData.id;
      const receiverId = req.params.user_id * 1;
      const msg = req.body.message;
      if (!msg || !msg.trim()) {
        throw errMsg.generateMsg(403, 'Message Cannot Be Blank');
      }
      const id = await model.sendMsg(myId, receiverId, msg);
      const successObj = {
        data: {
          message: {
            id: 1,
          },
        },
      };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
};
