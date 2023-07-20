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
  send: async (type, text, performerId, recipientId) => {
    const conn = await pool.getConnection();
    try {
      const findUserName = 'SELECT name FROM users WHERE id = ?';
      const [[performerName]] = await conn.query(findUserName, [performerId]);
      const summary = `${performerName.name}${text}`;
      const insert =
        'INSERT INTO events (type,created_at,summary,performer_id,recipient_id) VALUES (?,now(),?,?,?)';
      await conn.query(insert, [type, summary, performerId, recipientId]);
    } catch (err) {
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
  getEvent: async (id) => {
    const conn = await pool.getConnection();
    try {
      const findNotif = `
        SELECT events.id, type, is_read, picture, created_at, summary 
        FROM users INNER JOIN events ON users.id = events.performer_id 
        WHERE recipient_id = ?`;
      const [allNotif] = await conn.query(findNotif, [id]);
      return allNotif;
    } catch (err) {
      console.log(err);
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
  readEvent: async (eventId, userId) => {
    const conn = await pool.getConnection();
    try {
      unRead = false;
      isRead = true;
      const findNotif =
        'UPDATE events SET is_read = ? WHERE (id = ? AND recipient_id = ? AND is_read = ?)';
      await conn.query(findNotif, [isRead, eventId, userId, unRead]);
      return eventId;
    } catch (err) {
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
};
