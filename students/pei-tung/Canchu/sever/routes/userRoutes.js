const express = require("express");
const userController = require("../controllers/userController");
const userUtil = require("../../util/userUtil");
const router = express.Router();
const multer = require("multer");

router.post("/signup", userController.signUp);
router.post("/signIn", userController.signIn);
router.get(
  "/:id/profile",
  userController.authorization,
  userController.userProfile
);
router.put(
  "/profile",
  userController.authorization,
  userController.userProfileUpdate
);
router.put(
  "/picture",
  userController.authorization,
  userUtil.pictureUploadSetting().single("picture"),
  userController.userPictureUpdate
);

module.exports = router;
