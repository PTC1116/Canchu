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
  post: async (id, context) => {
    const conn = await pool.getConnection();
    try {
      const insertData =
        "INSERT INTO posts (posted_by, context, created_at) VALUES (?,?, now())";
      const result = await conn.query(insertData, [id, context]);
      return result[0].insertId;
    } catch (err) {
      throw err;
    } finally {
      await conn.release();
    }
  },
  postUpdated: async (userId, postId, context) => {
    const conn = await pool.getConnection();
    try {
      const updateData =
        "UPDATE posts SET context = ? WHERE post_id = ? AND posted_by = ?";
      const result = await conn.query(updateData, [context, postId, userId]);
      return postId;
    } catch (err) {
      console.log(err);
    } finally {
      await conn.release();
    }
  },
};
