const userModel = require("../models/userModel");
const userUtil = require("../../util/userUtil");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
const axios = require("axios");
const errMes = require("../../util/errorMessage");

module.exports = {
  signUp: async (req, res) => {
    try {
      // Check if every fields are filled
      const { name, email, password } = req.body;
      const provider = "native";
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // 應該要用別的方法驗證，這個方式沒有 name 或 email 或 password 的時候 code 會沒辦法 trim
      if (
        name.trim().length === 0 ||
        email.trim().length === 0 ||
        password.trim().length === 0
      ) {
        return res.status(400).send("Sign Up Failed");
      }
      const result = await userModel.signUp(
        name,
        email,
        hashedPassword,
        provider
      );
      const user = userUtil.generateUserObj(result);
      const token = jwt.sign(user, process.env.JWT_KEY);
      const successRes = {
        data: {
          access_token: token,
          user: user,
        },
      };
      return res.status(200).send(successRes);
    } catch (err) {
      // reject object 會傳到這裡
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
  signIn: async (req, res) => {
    try {
      const { provider, email, password } = req.body;
      if (provider === "native" && Object.keys(req.body).length !== 3) {
        return errMes.clientError;
      }
      if (provider === "native") {
        const result = await userModel.nativeSignIn(email, password);
        const user = userUtil.generateUserObj(result);
        const token = jwt.sign(user, process.env.JWT_KEY);
        const successRes = {
          data: {
            access_token: token,
            user: user,
          },
        };
        return res.status(200).send(successRes);
      } else if (provider === "facebook") {
        const accessToken = req.body.access_token;
        const userData = await axios.get(
          `https://graph.facebook.com/v13.0/me?fields=id,name,email&access_token=${accessToken}`
        );
        const { id, name, email } = userData.data;
        const provider = "facebook";
        const result = await userModel.fbSignIn(name, email, provider);
        const user = userUtil.generateUserObj(result);
        const token = jwt.sign(user, process.env.JWT_KEY);
        const successRes = {
          data: {
            access_token: token,
            user: user,
          },
        };
        return res.status(200).send(successRes);
      } else {
        return res.status(403).send({ error: "Sign In Failed" });
      }
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send({ error: err.error });
      } else {
        console.log(err);
      }
    }
  },
  // userProfile
  userProfile: async (req, res) => {
    try {
      const id = req.params.id;
      const userDataResult = await userModel.userProfile(id);
      const user = userUtil.generateUserDetailObj(userDataResult);
      const successRes = {
        data: {
          user: user,
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
  // userPictureUpdate
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
  // userProfileUpdate
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
        return res.status(400).send("Client Error Response");
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
      console.log(`myId:${myId}`);
      console.log(`keyword:${searchFor}`);
      const searchResult = await userModel.search(myId, searchFor);
      const users = userUtil.generateUserSearchObj(searchResult);
      console.log(users);
      const successObj = { data: { users } };
      console.log(successObj);
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
