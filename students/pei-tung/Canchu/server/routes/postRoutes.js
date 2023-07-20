const auth = require('../../util/auth');
const controller = require('../controllers/postController');
const express = require('express');
const router = express.Router();

router.post('/', auth.auth, controller.post);
// router.get("/search", auth.auth, controller.search);
router.put('/:id', auth.auth, controller.postUpdated);
router.post('/:id/like', auth.auth, controller.createLike);
router.delete('/:id/like', auth.auth, controller.deleteLike);
router.post('/:id/comment', auth.auth, controller.createComment);
router.get('/:id', auth.auth, controller.getPostDetail);

module.exports = router;
