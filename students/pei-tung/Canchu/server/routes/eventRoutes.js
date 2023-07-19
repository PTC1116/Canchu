const express = require('express');
const eventController = require('../controllers/eventController');
const auth = require('../../util/auth');
const router = express.Router();

// router.get("/", auth.auth, eventController.getEvent);
// router.post("/:event_id/read", auth.auth, eventController.readEvent);

module.exports = router;
