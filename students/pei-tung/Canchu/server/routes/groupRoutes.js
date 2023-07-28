const express = require('express');
const router = express.Router();
const auth = require('../../util/auth');
const controller = require('../controllers/groupController');

router.post('/', auth.auth, controller.createGroup);
router.delete('/:group_id', auth.auth, controller.delGroup);
router.post('/:group_id/join', auth.auth, controller.joinGroup);

module.exports = router;
