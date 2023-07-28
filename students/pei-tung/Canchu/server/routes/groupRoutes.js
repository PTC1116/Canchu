const express = require('express');
const router = express.Router();
const auth = require('../../util/auth');
const controller = require('../controllers/groupController');

router.get('/', auth.auth, controller.createGroup);

module.exports = router;
