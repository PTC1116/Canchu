const mysql = require("mysql2");
const errMes = require("../../util/errorMessage");

const setPool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const pool = setPool.promise();

module.exports = {
  friend: () => {
    return "hi";
  },
  friendPending: async (id) => {
    const conn = await pool.getConnection();
    try {
      const findMyRequester = "SELECT * FROM friends WHERE receiverID = ?";
      const requesterId = await conn.query(findMyRequester, [id]);
      const requesterData = [];
      for (let i = 0; i < requesterId[0].length; i++) {
        const targetId = requesterId[0][i].requesterID;
        const findRequesterData =
          "SELECT DISTINCT users.id, name, picture,friends.ID FROM users INNER JOIN friends ON users.id = friends.requesterID WHERE users.id = ?;";
        const result = await conn.query(findRequesterData, targetId);
        requesterData.push(result[0][0]);
      }
      return requesterData;
    } catch (err) {
      console.log(err);
    } finally {
      await conn.release();
    }
  },
  friendRequest: async (requesterId, receiverId) => {
    const conn = await pool.getConnection();
    try {
      const checkStatus =
        "SELECT * FROM friends WHERE requesterID = ? AND receiverID = ?";
      const requesterResult = await conn.query(checkStatus, [
        requesterId,
        receiverId,
      ]);
      const receiverResult = await conn.query(checkStatus, [
        receiverId,
        requesterId,
      ]);
      if (requesterResult[0].length > 0 || receiverResult[0].length > 0) {
        throw errMes.clientError;
      }
      const status = "requested";
      const insert =
        "INSERT INTO friends (requesterID, receiverID, status) VALUES(?,?,?)";
      const insertResult = await conn.query(insert, [
        requesterId,
        receiverId,
        status,
      ]);
      const findFriendshipId =
        "SELECT ID FROM friends WHERE requesterID = ? AND receiverID = ?";
      const result = await conn.query(findFriendshipId, [
        requesterId,
        receiverId,
      ]);
      return result[0][0];
    } catch (err) {
      if (err === errMes.clientError) {
        throw errMes.clientError;
      } else {
        throw errMes.serverError;
      }
    } finally {
      await conn.release();
    }
  },
};
