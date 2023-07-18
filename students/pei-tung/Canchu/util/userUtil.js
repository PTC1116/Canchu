const multer = require('multer');

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
        cb(null, 'public');
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix);
      },
    });
    const upload = multer({ storage });
    return upload;
  },
  generateUserSearchObj: (arr) => {
    const users = [];
    arr.forEach((el) => {
      const { userId, name, picture, id, status } = el;
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
    });
    return users;
  },
};
