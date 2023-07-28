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
    // 檢查兩個用戶都存在？
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
};
