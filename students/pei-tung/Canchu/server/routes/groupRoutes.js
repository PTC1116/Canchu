const express = require('express');
const router = express.Router();
const auth = require('../../util/auth');
const controller = require('../controllers/groupController');

router.post('/', auth.auth, controller.createGroup);
router.delete('/:group_id', auth.auth, controller.delGroup);
router.post('/:group_id/join', auth.auth, controller.joinGroup);
router.get('/:group_id/member/pending', auth.auth, controller.getPendingList);
router.post(
  '/:group_id/member/:user_id/agree',
  auth.auth,
  controller.agreeJoinReq,
);
router.post('/:group_id/post', auth.auth, controller.post);
router.get('/:group_id/posts', auth.auth, controller.getAllPost);
module.exports = router;
