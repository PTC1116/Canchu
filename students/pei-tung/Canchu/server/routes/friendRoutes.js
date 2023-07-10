const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");
const friendUtil = require("../../util/friendUtil");
const auth = require("../../util/auth");

router.get("/", auth.auth, friendController.friend);
router.get("/pending", auth.auth, friendController.friendPending);
router.post("/:user_id/request", auth.auth, friendController.friendRequest);

module.exports = router;
