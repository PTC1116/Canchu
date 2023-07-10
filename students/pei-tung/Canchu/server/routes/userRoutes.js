const express = require("express");
const userController = require("../controllers/userController");
const userUtil = require("../../util/userUtil");
const auth = require("../../util/auth");
const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/signIn", userController.signIn);
router.get("/:id/profile", auth.authorization, userController.userProfile);
router.put("/profile", auth.authorization, userController.userProfileUpdate);
router.put(
  "/picture",
  auth.authorization,
  userUtil.pictureUploadSetting().single("picture"),
  userController.userPictureUpdate
);

module.exports = router;
