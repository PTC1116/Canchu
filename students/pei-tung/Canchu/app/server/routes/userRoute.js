const express = require('express');
const userController = require('../controllers/userController');
const userUtil = require('../../util/userUtil');
const auth = require('../../util/auth');
const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/signIn', userController.signIn);
router.get('/:id/profile', auth.auth, userController.userProfile);
router.put('/profile', auth.auth, userController.userProfileUpdate);
router.put(
  '/picture',
  auth.auth,
  userUtil.pictureUploadSetting().single('picture'),
  userController.userPictureUpdate,
);
router.get('/search', auth.auth, userController.search);

module.exports = router;
