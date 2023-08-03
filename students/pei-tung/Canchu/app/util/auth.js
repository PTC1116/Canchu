const jwt = require("jsonwebtoken");

module.exports = {
  auth: (req, res, next) => {
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
};
