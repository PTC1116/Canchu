const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");
const friendUtil = require("../../util/friendUtil");

router.get("/", friendController.friend);
router.get("/pending", friendController.friendPending);
router.post("/:user_id/request", friendController.friendRequest);

module.exports = router;
