const axios = require('axios');
const multer = require('multer');
const userModel = require('../models/userModel');
const userUtil = require('../../util/userUtil');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const errMsg = require('../../util/errorMessage');

module.exports = {
  signUp: async (req, res) => {
    try {
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
      const { provider } = req.body;
      if (!provider) {
        throw errMsg.generateMsg(400, 'Sign In Failed: Provider Field Missing');
      }
      if (provider === 'native') {
        const { email, password } = req.body;
        if (!email || !password) {
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
      const user = await userModel.userProfile(myId, targetId);
      const successRes = {
        data: {
          user,
        },
      };
      res.status(200).send(successRes);
    } catch (err) {
      console.log(err);
      return res.status(err.status).send({ error: err.error });
    }
  },
  userPictureUpdate: async (req, res) => {
    try {
      const picPath = req.file.path;
      const id = req.userData.id;
      const updatedPic = await userModel.userPictureUpdate(id, picPath);
      const successRes = {
        data: {
          picture: updatedPic,
        },
      };
      return res.status(200).send(successRes);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
  userProfileUpdate: async (req, res) => {
    try {
      const id = req.userData.id;
      console.log(req);
      const { name, introduction: intro, tags } = req.body;
      if (
        name.trim().length === 0 ||
        intro.trim().length === 0 ||
        tags.trim().length === 0
      ) {
        return res.status(400).send('Client Error Response');
      }
      const result = await userModel.userProfileUpdate(name, intro, tags, id);
      const successRes = {
        data: {
          user: {
            id: result,
          },
        },
      };
      return res.status(200).send(successRes);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
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
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
};
