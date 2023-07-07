const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const multer = require("multer");

module.exports = {
  authorization: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).send({ error: "No Token" });
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
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
      const userData = await userModel.userProfile(id);
      const successRes = {
        data: {
          user: userData,
        },
      };
      return res.status(200).send(successRes);
    } catch (err) {
      console.log(err);
    }
  },
  // userPictureUpdate
  userPictureUpdate: async (req, res) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "../static/pictures");
      },
      // 不是很懂這段
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
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
      const updatedData = await userModel.userProfileUpdate(
        name,
        intro,
        tags,
        id
      );
      const successRes = {
        data: {
          user: {
            id: updatedData,
          },
        },
      };
      return res.status(200).send(successRes);
    } catch (err) {
      console.log(err);
    }
  },
};
