const axios = require('axios');
const multer = require('multer');
const userModel = require('../models/userModel');
const userUtil = require('../../util/userUtil');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const errMsg = require('../../util/errorMessage');
const cache = require('../../util/cache');

module.exports = {
  signUp: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        throw errMsg.invaildHeader;
      }
      const { name, email, password } = req.body;
      if (
        !name ||
        !name.trim() ||
        !email ||
        !email.trim() ||
        !password ||
        !password.trim()
      ) {
        throw errMsg.generateMsg(
          400,
          'Sign Up Failed: Please fill out all fields',
        );
      }
      const provider = 'native';
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const result = await userModel.signUp(
        name,
        email,
        hashedPassword,
        provider,
      );
      const user = userUtil.generateUserObj(result);
      const token = jwt.sign(user, process.env.JWT_KEY);
      const successRes = {
        data: {
          access_token: token,
          user,
        },
      };
      res.status(200).send(successRes);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  signIn: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        throw errMsg.invaildHeader;
      }
      const { provider } = req.body;
      if (!provider || !provider.trim()) {
        throw errMsg.generateMsg(400, 'Sign In Failed: Provider Field Missing');
      }
      if (provider === 'native') {
        const { email, password } = req.body;
        if (!email || !email.trim() || !password || !password.trim()) {
          throw errMsg.generateMsg(
            400,
            'Sign In Failed: Please fill out all fields',
          );
        }
        const result = await userModel.nativeSignIn(email, password);
        const user = userUtil.generateUserObj(result);
        const token = jwt.sign(user, process.env.JWT_KEY);
        const successRes = {
          data: {
            access_token: token,
            user,
          },
        };
        res.status(200).send(successRes);
      } else if (provider === 'facebook') {
        const accessToken = req.body.access_token;
        const userData = await axios.get(
          `https://graph.facebook.com/v13.0/me?fields=id,name,email&access_token=${accessToken}`,
        );
        const { name, email } = userData.data;
        const provider = 'facebook';
        const result = await userModel.fbSignIn(name, email, provider);
        const user = userUtil.generateUserObj(result);
        const token = jwt.sign(user, process.env.JWT_KEY);
        const successRes = {
          data: {
            access_token: token,
            user,
          },
        };
        res.status(200).send(successRes);
      } else {
        throw errMsg.generateMsg(403, 'Sign In Failed: Invalid Provider');
      }
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  userProfile: async (req, res) => {
    try {
      const targetId = req.params.id;
      const myId = req.userData.id;
      // 改成只要有缺就重新撈資料
      const profileCache = await cache.getProfile(targetId);
      const friendshipCache = await cache.getFriendship(myId, targetId);
      console.log(friendshipCache);
      console.log(profileCache);
      let successRes;
      if (profileCache && friendshipCache) {
        successRes = {
          data: {
            user: { ...profileCache, ...friendshipCache },
          },
        };
      } else {
        const user = await userModel.userProfile(myId, targetId);
        successRes = {
          data: {
            user,
          },
        };
        cache.saveProfile(successRes.data.user);
        cache.saveFriendship(myId, targetId, successRes.data.user);
      }
      res.status(200).send(successRes);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  userPictureUpdate: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (!header.includes('multipart/form-data')) {
        throw errMsg.invaildHeader;
      }
      const picName = req.file.filename;
      const id = req.userData.id;
      const updatedPicUrl = await userModel.userPictureUpdate(id, picName);
      const successRes = {
        data: {
          picture: updatedPicUrl,
        },
      };
      cache.delete('profile', id);
      console.log(successRes);
      return res.status(200).send(successRes);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  userProfileUpdate: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        throw errMsg.invaildHeader;
      }
      const id = req.userData.id;
      const { name, introduction: intro, tags } = req.body;
      if (!name || !name.trim().length) {
        return res.status(400).send('Please fill out all fields');
      }
      const result = await userModel.userProfileUpdate(name, intro, tags, id);
      const successRes = {
        data: {
          user: {
            id: result,
          },
        },
      };
      cache.delete('profile', id);
      return res.status(200).send(successRes);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  search: async (req, res) => {
    try {
      const myId = req.userData.id;
      const searchFor = req.query.keyword;
      const searchResult = await userModel.search(myId, searchFor);
      const users = userUtil.generateUserSearchObj(searchResult);
      const successObj = { data: { users } };
      res.status(200).send(successObj);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
};
