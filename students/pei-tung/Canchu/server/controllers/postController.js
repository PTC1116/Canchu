const model = require('../models/postModel');
const errMsg = require('../../util/errorMessage');
const util = require('../../util/postUtil');

module.exports = {
  post: async (req, res) => {
    try {
      const authorId = req.userData.id;
      const context = req.body.context;
      if (!context || !context.trim()) {
        throw errMsg.generateMsg(403, 'Post Context Cannot Be Blank');
      }
      const postId = await model.post(authorId, context);
      const successObj = { data: { post: { id: postId } } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      res.status(err.status).send({ error: err.error });
    }
  },
  postUpdated: async (req, res) => {
    try {
      const userId = req.userData.id;
      const postId = req.params.id * 1;
      const newContext = req.body.context;
      if (!newContext || !newContext.trim()) {
        throw errMsg.generateMsg(403, 'Update Context Cannot Be Blank');
      }
      const result = await model.postUpdated(userId, postId, newContext);
      const successObj = { data: { post: { id: result } } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      res.status(err.status).send({ error: err.error });
    }
  },
  createLike: async (req, res) => {
    try {
      const userId = req.userData.id;
      const postId = req.params.id * 1;
      const result = await model.createLike(userId, postId);
      const successObj = { data: { post: { id: result } } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      res.status(err.status).send({ error: err.error });
    }
  },
  deleteLike: async (req, res) => {
    try {
      const userId = req.userData.id;
      const postId = req.params.id * 1;
      const result = await model.deleteLike(userId, postId);
      const successObj = { data: { post: { id: result } } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  createComment: async (req, res) => {
    try {
      const userId = req.userData.id;
      const postId = req.params.id * 1;
      const content = req.body.content;
      if (!content || !content.trim()) {
        throw errMsg.generateMsg(403, 'Comment Content Cannot Be Blank');
      }
      const result = await model.createComment(userId, postId, content);
      const successObj = {
        data: { post: { id: postId }, comment: { id: result } },
      };
      res.status(200).json(successObj);
    } catch (err) {
      console.log(err);
      res.status(err.status).send({ error: err.error });
    }
  },
  getPostDetail: async (req, res) => {
    try {
      const postId = req.params.id * 1;
      const userId = req.userData.id;
      const result = await model.getPostDetail(userId, postId);
      const successObj = { data: result };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      res.status(err.status).send({ error: err.error });
    }
  },
  search: async (req, res) => {
    try {
      const targetId = req.query.user_id;
      const myId = req.userData.id;
      const itemsPerPage = 10;
      const itemsPerQuery = itemsPerPage + 1;
      let cursor = (await model.countTotalPost()) + 1;
      const cursorStr = req.query.cursor;
      if (cursorStr) {
        cursor = Buffer.from(cursorStr, 'base64').toString('utf-8');
      }
      let result;
      if (targetId) {
        result = await model.getTimelineByUserId(
          myId,
          targetId,
          itemsPerQuery,
          cursor,
        );
      } else {
        result = await model.getMyTimeline(myId, itemsPerQuery, cursor);
      }
      const posts = util.generatePostSearchObj(result, itemsPerPage); // 回來要改這個，設定為 10
      let successObj;
      if (result.length < itemsPerQuery) {
        successObj = { data: { posts, next_cursor: null } };
      } else {
        const nextPageIndex = posts[posts.length - 1].id;
        let nextCursor = Buffer.from(nextPageIndex.toString()).toString(
          'base64',
        );
        successObj = { data: { posts, next_cursor: nextCursor } };
      }
      res.status(200).send(successObj);
    } catch (err) {
      res.status(err.status).send({ error: err.error });
    }
  },
};
