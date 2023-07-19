const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const friendUtil = require('../../util/friendUtil');
const auth = require('../../util/auth');

// router.get("/", auth.auth, friendController.showAllFriends);
router.get('/pending', auth.auth, friendController.pending);
router.post('/:user_id/request', auth.auth, friendController.request);
router.post('/:friendship_id/agree', auth.auth, friendController.agree);
router.delete('/:friendship_id', auth.auth, friendController.delete);
module.exports = router;
