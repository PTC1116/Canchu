const multer = require('multer');
const path = require('path');

module.exports = {
  generateUserObj: (obj) => {
    const { id, provider, email, name, picture } = obj;
    return { id, provider, email, name, picture };
  },
  generateUserDetailObj: (obj) => {
    const { id, name, picture, friend_count, introduction, tags, friendship } =
      obj;
    return { id, name, picture, friend_count, introduction, tags, friendship };
  },
  pictureUploadSetting: () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/pictures');
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename =
          Date.now() + '-' + Math.floor(Math.random() * 100000) + ext;
        cb(null, filename);
      },
    });
    const upload = multer({ storage });
    return upload;
  },
  generateUserSearchObj: (arr) => {
    const users = [];
    for (let i = 0; i < arr.length; i++) {
      const { userId, name, picture, id, status } = arr[i];
      let obj = {};
      if (id === null) {
        obj = {
          id: userId,
          name,
          picture,
          friendship: null,
        };
      } else {
        obj = {
          id: userId,
          name,
          picture,
          friendship: { id, status },
        };
      }
      users.push(obj);
    }
    return users;
  },
};
