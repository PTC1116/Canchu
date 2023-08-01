const errMsg = require('../../util/errorMessage');
const model = require('../models/chatModels');
const util = require('../../util/chatUtil');

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
  viewAllMsg: async (req, res) => {
    try {
      const targetId = req.params.user_id * 1;
      const myId = req.userData.id;
      const itemsPerPage = 10; //要改這個
      const itemsPerQuery = itemsPerPage + 1;
      let cursorStr = req.query.cursor;
      if (cursorStr) {
        cursor = Buffer.from(cursorStr, 'base64').toString('utf-8');
      } else {
        const result = await model.findNewestPost();
        cursor = result.id + 1;
      }
      const allMsg = await model.viewAllMsg(
        myId,
        targetId,
        itemsPerQuery,
        cursor,
      );
      const messages = util.generateAllMsgObj(allMsg, itemsPerPage);
      if (allMsg.length < itemsPerQuery) {
        successObj = { data: { messages, next_cursor: null } };
      } else {
        const nextPageIndex = messages[messages.length - 1].id;
        let nextCursor = Buffer.from(nextPageIndex.toString()).toString(
          'base64',
        );
        successObj = { data: { messages, next_cursor: nextCursor } };
      }
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
};
