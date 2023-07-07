const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// router.post("/:id/profile", userController.authorization);
// router.put("/picture", userController.authorization);
router.post(
  "/:id/profile",
  userController.authorization,
  userController.userProfile
);

router.put(
  "/profile",
  userController.authorization,
  userController.userProfileUpdate
);

/* router.get("/:id/profile", (req, res) => {
  res.send("Nice");
}); */
/*router.get("/picture", (req, res) => {
  res.send("hi");
});*/

module.exports = router;
