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
      throw errMes.serverError;
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
      throw errMes.serverError;
    } finally {
      await conn.release();
    }
  },
  createLike: async (userId, postId) => {
    const conn = await pool.getConnection();
    try {
      // 查看該貼文是否已被該用戶按讚過
      const findTargetPost =
        "SELECT * FROM likes WHERE like_user = ? AND post_id = ?";
      const result = await conn.query(findTargetPost, [userId, postId]);
      if (result[0].length > 0) {
        throw errMes.clientError;
      }
      const insertData = `INSERT INTO likes(like_user, post_id)
        SELECT ?, ?
        WHERE NOT EXISTS (
            SELECT 1
            FROM likes
            WHERE like_user = ? AND post_id = ?
        );`;
      await conn.query(insertData, [userId, postId, userId, postId]);
      return postId;
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
  deleteLike: async (userId, postId) => {
    const conn = await pool.getConnection();
    try {
      const findTargetPost =
        "SELECT * FROM likes WHERE like_user = ? AND post_id = ?";
      const result = await conn.query(findTargetPost, [userId, postId]);
      if (result[0].length === 0) {
        throw errMes.clientError;
      }
      const deleteLike =
        "DELETE FROM likes WHERE like_user = ? AND post_id = ?";
      await conn.query(deleteLike, [userId, postId]);
      return postId;
    } catch (err) {
      if (err === errMes.clientError) {
        throw errMes.clientError;
      } else {
        console.log(err);
        // throw errMes.serverError;
      }
    } finally {
      await conn.release();
    }
  },
};
