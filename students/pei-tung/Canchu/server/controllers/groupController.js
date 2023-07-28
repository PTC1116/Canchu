const errMsg = require('../../util/errorMessage');
const model = require('../models/groupModel');
const util = require('../../util/groupUtil');

module.exports = {
  createGroup: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        throw errMsg.invaildHeader;
      }
      const creatorId = req.userData.id;
      const groupName = req.body.name;
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
  delGroup: async (req, res) => {
    try {
      const userId = req.userData.id;
      const groupId = req.params.group_id * 1;
      const id = await model.delGroup(groupId, userId);
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
  joinGroup: async (req, res) => {
    try {
      const userId = req.userData.id;
      const groupId = req.params.group_id * 1;
      const id = await model.joinGroup(groupId, userId);
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
  getPendingList: async (req, res) => {
    try {
      const userId = req.userData.id;
      const groupId = req.params.group_id * 1;
      const result = await model.getPendingList(groupId, userId);
      const users = util.generatePendingObj(result);
      const successObj = {
        data: {
          users,
        },
      };
      console.log(successObj);
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  agreeJoinReq: async (req, res) => {
    try {
      const userId = req.userData.id;
      const groupId = req.params.group_id * 1;
      const requesterId = req.params.user_id * 1;
      const id = await model.agreeJoinReq(groupId, userId, requesterId);
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
  post: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        throw errMsg.invaildHeader;
      }
      const userId = req.userData.id;
      const groupId = req.params.group_id * 1;
      const context = req.body.context;
      if (!context || !context.trim()) {
        throw errMsg.generateMsg(403, 'Post Context Cannot Be Blank');
      }
      const result = await model.post(groupId, userId, context);
      const successObj = {
        data: {
          group: {
            id: result.groupId,
          },
          user: {
            id: result.userId,
          },
          post: {
            id: result.postId,
          },
        },
      };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  getAllPost: async (req, res) => {
    try {
      const userId = req.userData.id;
      const groupId = req.params.group_id * 1;
      const result = await model.getAllPosts(groupId, userId);
      const posts = util.generatePostObj(result);
      const successObj = { data: { posts } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
};
