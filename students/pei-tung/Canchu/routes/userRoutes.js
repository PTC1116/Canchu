const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// router.post("/:id/profile", userController.authorization);
// router.put("/picture", userController.authorization);
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
  upload.single("picture"),
  userController.userPictureUpdate
);

/* router.get("/:id/profile", (req, res) => {
  res.send("Nice");
}); */
/*router.get("/picture", (req, res) => {
  res.send("hi");
});*/

module.exports = router;
