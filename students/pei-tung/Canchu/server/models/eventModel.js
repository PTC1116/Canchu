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
  send: async (type, text, performerId, recipientId) => {
    const conn = await pool.getConnection();
    try {
      const findUserName = "SELECT name FROM users WHERE id = ?";
      const performerName = await conn.query(findUserName, [performerId]);
      const summary = `${performerName[0][0].name}${text}`;
      const insert =
        "INSERT INTO events (type,created_at,summary,performer_id,recipient_id) VALUES (?,now(),?,?,?)";
      await conn.query(insert, [type, summary, performerId, recipientId]);
    } catch (err) {
      return err;
      // return errMes.serverError;
    } finally {
      await conn.release();
    }
  },
};
