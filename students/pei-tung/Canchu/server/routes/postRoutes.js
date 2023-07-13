const auth = require("../../util/auth");
const controller = require("../controllers/postController");
const express = require("express");
const router = express.Router();

router.post("/", auth.auth, controller.post);
router.put("/:id", auth.auth, controller.postUpdated);
router.post("/:id/like", auth.auth, controller.createLike);

module.exports = router;
