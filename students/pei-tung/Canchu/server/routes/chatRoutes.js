const auth = require('../../util/auth');
const controller = require('../controllers/chatController');
const express = require('express');
const router = express.Router();

router.post('/:user_id', auth.auth, controller.sendMsg);
router.get('/:user_id/messages', auth.auth, controller.viewAllMsg);
module.exports = router;
