const model = require("../models/postModel");

module.exports = {
  post: async (req, res) => {
    try {
      const authorId = req.userData.id;
      const context = req.body.context;
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
      const result = await model.postUpdated(userId, postId, newContext);
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
};
