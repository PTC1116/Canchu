const errMsg = require('../../util/errorMessage');
const model = require('../models/groupModel');

module.exports = {
  createGroup: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        throw errMsg.invaildHeader;
      }
      const creatorId = req.userData.id;
      const { name: groupName } = req.body;
      if (!groupName || !groupName.trim()) {
        throw errMsg.generateMsg(400, 'Please Name Your Group');
      }
      const id = await model.createGroup(groupName, creatorId);
      const successObj = {
        data: {
          group: {
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
};
