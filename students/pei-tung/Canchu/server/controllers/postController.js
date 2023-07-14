const model = require("../models/postModel");
const errMes = require("../../util/errorMessage");
const util = require("../../util/postUtil");

module.exports = {
  post: async (req, res) => {
    try {
      const authorId = req.userData.id;
      const context = req.body.context;
      if (!context.trim()) {
        throw errMes.clientError;
      }
      const postId = await model.post(authorId, context);
      const successObj = { data: { post: { id: postId } } };
      res.status(200).send(successObj);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
  postUpdated: async (req, res) => {
    try {
      const userId = req.userData.id;
      const postId = req.params.id * 1;
      const newContext = req.body.context;
      if (!newContext.trim()) {
        throw errMes.clientError;
      }
      const result = await model.postUpdated(userId, postId, newContext);
      const successObj = { data: { post: { id: result } } };
      res.status(200).send(successObj);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
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
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
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
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
  createComment: async (req, res) => {
    try {
      const userId = req.userData.id;
      const postId = req.params.id * 1;
      const content = req.body.content;
      const result = await model.createComment(userId, postId, content);
      const successObj = {
        data: { post: { id: postId }, comment: { id: result } },
      };
      res.status(200).send(successObj);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
  getPostDetail: async (req, res) => {
    try {
      const postId = req.params.id * 1;
      const result = await model.getPostDetail(postId);
      const successObj = { data: result };
      res.status(200).send(successObj);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
  search: async (req, res) => {
    try {
      const targetId = req.query.user_id;
      const cursorStr = req.query.cursor;
      const myId = req.userData.id;
      const itemsPerPage = 10;
      let nextCursor;
      let result;
      if (cursorStr && targetId) {
        const decodedCursor = Buffer.from(cursorStr, "base64").toString(
          "utf-8"
        );
        const nextPageIndex = decodedCursor * 1 + itemsPerPage;
        nextCursor = Buffer.from(nextPageIndex.toString()).toString("base64");
        result = await model.getTimelineByUserId(
          targetId,
          decodedCursor,
          itemsPerPage
        );
      } else if (cursorStr && !targetId) {
        const decodedCursor = Buffer.from(cursorStr, "base64").toString(
          "utf-8"
        );
        const nextPageIndex = decodedCursor * 1 + itemsPerPage;
        nextCursor = Buffer.from(nextPageIndex.toString()).toString("base64");
        result = await model.getMyTimeline(myId, decodedCursor, itemsPerPage);
      } else if (!cursorStr && targetId) {
        const nextPageIndex = itemsPerPage;
        nextCursor = Buffer.from(nextPageIndex.toString()).toString("base64");
        result = await model.getTimelineByUserId(targetId);
      } else if (!cursorStr && !targetId) {
        const nextPageIndex = itemsPerPage;
        nextCursor = Buffer.from(nextPageIndex.toString()).toString("base64");
        result = await model.getMyTimeline(myId);
      }
      const posts = util.generatePostSearchObj(result);
      let successObj;
      if (posts.length < itemsPerPage) {
        successObj = { data: { posts, next_cursor: null } };
      } else {
        successObj = { data: { posts, next_cursor: nextCursor } };
      }
      res.status(200).send(successObj);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
};
