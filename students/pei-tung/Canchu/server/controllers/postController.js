const model = require("../models/postModel");
const errMes = require("../../util/errorMessage");

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
};
