const mysql = require("mysql2");
const errMes = require("../../util/errorMessage");
const errorMessage = require("../../util/errorMessage");

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
  pending: async (id) => {
    const conn = await pool.getConnection();
    try {
      const findMyRequester = "SELECT * FROM friends WHERE receiver_id = ?";
      const requesterId = await conn.query(findMyRequester, [id]);
      const requesterData = [];
      for (let i = 0; i < requesterId[0].length; i++) {
        const targetId = requesterId[0][i].requester_id;
        // 要再想想 DISTINCT 是否是必要的
        const findRequesterData =
          "SELECT DISTINCT name, picture, friends.id FROM users INNER JOIN friends ON users.id = friends.requester_id WHERE users.id = ?;";
        const result = await conn.query(findRequesterData, targetId);
        requesterData.push(result[0][0]);
        requesterData[i].userId = targetId;
      }
      return requesterData;
    } catch (err) {
      console.log(err);
    } finally {
      await conn.release();
    }
  },
  request: async (requesterId, receiverId) => {
    const conn = await pool.getConnection();
    try {
      const checkStatus =
        "SELECT * FROM friends WHERE requester_id = ? AND receiver_id = ?";
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
        "INSERT INTO friends (requester_id, receiver_id, status) VALUES(?,?,?)";
      const insertResult = await conn.query(insert, [
        requesterId,
        receiverId,
        status,
      ]);
      const findFriendshipId =
        "SELECT ID FROM friends WHERE requester_id = ? AND receiver_id = ?";
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
  agree: async (uId, fId) => {
    const conn = await pool.getConnection();
    try {
      const newStatus = "friend";
      const originalStatus = "requested";
      const findFriendshipById =
        "SELECT * FROM friends WHERE id = ? AND receiver_id = ? AND status = ?";
      const findResult = await conn.query(findFriendshipById, [
        fId,
        uId,
        originalStatus,
      ]);
      if (findResult[0].length === 0) {
        throw errMes.clientError;
      }
      const updateFriendshipById =
        "UPDATE friends SET status = ? WHERE id = ? AND receiver_id = ? AND status = ?";
      await conn.query(updateFriendshipById, [
        newStatus,
        fId,
        uId,
        originalStatus,
      ]);
      return fId;
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
  delete: async (uId, fId) => {
    const conn = await pool.getConnection();
    try {
      const findInvitation =
        "SELECT * FROM friends WHERE id = ? AND requester_id = ?";
      const findResult = await conn.query(findInvitation, [fId, uId]);
      // withdraw invitation
      if (findResult[0].length > 0) {
        const withdrawInvitation =
          "DELETE from friends WHERE id = ? AND requester_id = ?";
        await conn.query(withdrawInvitation, fId, uId);
        return fId;
      } else {
        const findFriendship =
          "SELECT * FROM friends WHERE (id = ? AND requester_id = ?) OR (id = ? AND receiver_id= ?)";
        const findResult = await conn.query(findFriendship, [
          fId,
          uId,
          fId,
          uId,
        ]);
        if (findResult[0].length === 0) {
          throw errMes.clientError;
        }
        // delete friend
        const deleteFriend =
          "DELETE FROM friends WHERE (id = ? AND requester_id = ?) OR (id = ? AND receiver_id= ?)";
        await conn.query(deleteFriend, [fId, uId, fId, uId]);
        return fId;
      }
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
