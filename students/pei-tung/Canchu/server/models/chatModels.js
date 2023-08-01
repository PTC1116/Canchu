const mysql = require('mysql2');
const errMsg = require('../../util/errorMessage');

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
  sendMsg: async (myId, receiverId, msg) => {
    const conn = await pool.getConnection();
    try {
      const checkReceiverStatus = 'SELECT id FROM users WHERE id = ?';
      const [receiverStatus] = await conn.query(checkReceiverStatus, [
        receiverId,
      ]);
      if (receiverStatus.length === 0) {
        throw errMsg.generateMsg(400, 'User Not Found');
      }
      const insertData =
        'INSERT INTO messages(sender, receiver, message, created_at) VALUES (?,?,?,now())';
      const [result] = await conn.query(insertData, [myId, receiverId, msg]);
      return result.insertId;
    } catch (err) {
      if (err.status === 400) {
        throw err;
      } else {
        console.log(err);
        throw errMsg.dbError;
      }
    } finally {
      conn.release();
    }
  },
  viewAllMsg: async (myId, targetId, itemsPerQuery, cursor) => {
    const conn = await pool.getConnection();
    try {
      console.log('?');
      const checkReceiverStatus = 'SELECT id FROM users WHERE id = ?';
      const [receiverStatus] = await conn.query(checkReceiverStatus, [
        targetId,
      ]);
      console.log(receiverStatus);
      if (receiverStatus.length === 0) {
        console.log('400');
        throw errMsg.generateMsg(400, 'User Not Found');
      }
      const findAllMsg = `SELECT messages.id AS id, message, 
        DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") AS created_at, 
        users.id AS userId, name, picture
        FROM users INNER JOIN messages ON users.id = messages.sender 
        WHERE (sender = ? AND receiver = ? AND messages.id < ?) OR (sender = ? AND receiver = ? AND messages.id < ?)
        ORDER BY messages.id DESC
        LIMIT ?`;
      const [result] = await conn.query(findAllMsg, [
        myId,
        targetId,
        cursor,
        targetId,
        myId,
        cursor,
        itemsPerQuery,
      ]);
      return result;
    } catch (err) {
      if (err.status === 400) {
        throw err;
      } else {
        console.log(err);
        throw errMsg.dbError;
      }
    } finally {
      conn.release();
    }
  },
  findNewestPost: async () => {
    const conn = await pool.getConnection();
    try {
      const findNewestPost =
        'SELECT id FROM messages ORDER BY messages.id DESC LIMIT 1';
      const [[newestId]] = await conn.query(findNewestPost);
      return newestId;
    } catch (err) {
      console.log(err);
      throw errMsg.dbError;
    } finally {
      conn.release();
    }
  },
};
