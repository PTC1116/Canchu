const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
const axios = require("axios");
const multer = require("multer");
const errMes = require("../../util/errorMessage");

module.exports = {
  signUp: async (req, res) => {
    try {
      // Check if every fields are filled
      const { name, email, password } = req.body;
      const provider = "native";
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password, salt);
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
      // 這邊要再優化
      const {
        id: userId,
        provider: userProvider,
        name: userName,
        email: userEmail,
        picture: userPicture,
      } = result;
      const user = {
        id: userId,
        name: userName,
        email: userEmail,
        provider: userProvider,
        picture: userPicture,
      };
      const token = jwt.sign(result, process.env.JWT_KEY);
      const successRes = {
        data: {
          access_token: token,
          user: result,
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
        const { id, provider, name, email: userEmail, picture } = result;
        const user = {
          id: id,
          name: name,
          email: email,
          provider: provider,
          picture: picture,
        };
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
        const {
          id: userId,
          provider: userProvider,
          name: userName,
          email: userEmail,
          picture,
        } = result;
        const user = {
          id: userId,
          name: userName,
          email: userEmail,
          provider: userProvider,
          picture,
        };
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
  authorization: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).send({ error: "No Token" });
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).send({ error: "Wrong token" });
      }
      const { id, name, picture } = decoded;
      req.userData = { id: id, name: name, picture: picture };
      return next();
    });
  },
  // userProfile
  userProfile: async (req, res) => {
    try {
      const id = req.params.id;
      const userDataResult = await userModel.userProfile(id);
      const {
        id: userId,
        name,
        picture,
        friend_count,
        introduction,
        tags,
        friendship,
      } = userDataResult;
      const userInfo = {
        id: userId,
        name,
        picture,
        friend_count,
        introduction,
        tags,
        friendship,
      };
      const successRes = {
        data: {
          user: userInfo,
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
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "../../public");
        },
        // 不是很懂這段
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix);
        },
      });
      const upload = multer({ storage: storage });
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
};
