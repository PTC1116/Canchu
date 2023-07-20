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
  post: async (id, context) => {
    const conn = await pool.getConnection();
    try {
      const insertData = `INSERT INTO posts (posted_by, context, created_at) VALUES (?,?, now())`;
      const [result] = await conn.query(insertData, [id, context]);
      return result.insertId;
    } catch (err) {
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
  checkPostExistenceById: async (conn, id) => {
    const findTargetPost = 'SELECT * FROM posts WHERE id = ?';
    const [result] = await conn.query(findTargetPost, [id]);
    if (result.length === 0) {
      return false;
    }
    return true;
  },
  postUpdated: async (userId, postId, context) => {
    const conn = await pool.getConnection();
    try {
      const postExistence = await module.exports.checkPostExistenceById(
        conn,
        postId,
      );
      if (!postExistence) {
        throw errMsg.generateMsg(403, 'Post Not Found');
      }
      const updateData =
        'UPDATE posts SET context = ? WHERE id = ? AND posted_by = ?';
      await conn.query(updateData, [context, postId, userId]);
      return postId;
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        throw errMsg.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  createLike: async (userId, postId) => {
    const conn = await pool.getConnection();
    try {
      const postExistence = await module.exports.checkPostExistenceById(
        conn,
        postId,
      );
      if (!postExistence) {
        throw errMsg.generateMsg(403, 'Post Not Found');
      }
      const isPostAlreadyLiked =
        'SELECT * FROM likes WHERE like_user = ? AND post = ?';
      const [result] = await conn.query(isPostAlreadyLiked, [userId, postId]);
      if (result.length > 0) {
        throw errMsg.generateMsg(403, 'Post Has Already Been Liked');
      }
      const insertData = `INSERT INTO likes (like_user, post) VALUE (?,?) ;`;
      await conn.query(insertData, [userId, postId, postId]);
      return postId;
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        console.log(err);
        throw errMsg.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  deleteLike: async (userId, postId) => {
    const conn = await pool.getConnection();
    try {
      const findTargetPost =
        'SELECT * FROM likes WHERE like_user = ? AND post = ?';
      const [result] = await conn.query(findTargetPost, [userId, postId]);
      if (result.length === 0) {
        throw errMsg.generateMsg(403, 'Like Not Found');
      }
      const deleteLike = 'DELETE FROM likes WHERE like_user = ? AND post = ?';
      await conn.query(deleteLike, [userId, postId]);
      return postId;
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        throw errMsg.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  createComment: async (userId, postId, content) => {
    const conn = await pool.getConnection();
    try {
      const postExistence = await module.exports.checkPostExistenceById(
        conn,
        postId,
      );
      if (!postExistence) {
        throw errMsg.generateMsg(403, 'Post Not Found');
      }
      const insertData = `INSERT INTO comments (author,post,content,created_at) VALUES (?,?,?,now())`;
      const [result] = await conn.query(insertData, [userId, postId, content]);
      return result.insertId;
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        throw errMsg.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  getPostDetail: async (userId, postId) => {
    const conn = await pool.getConnection();
    try {
      const postExistence = await module.exports.checkPostExistenceById(
        conn,
        postId,
      );
      if (!postExistence) {
        throw errMsg.generateMsg(403, 'Post Not Found');
      }
      const findPostOwner = `
      SELECT DISTINCT p.id AS postId, 
      DATE_FORMAT(p.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, 
      p.context, 
      IF((SELECT COUNT(id) FROM likes WHERE like_user = ? AND post = ?) > 0, true, false) AS is_liked,
      (SELECT COUNT(likes.id) FROM likes WHERE likes.post = p.id) AS like_count,
      (SELECT COUNT(comments.id) FROM comments WHERE comments.post = p.id) AS comment_count,
      u.picture, u.name 
      FROM users AS u
      INNER JOIN posts AS p ON u.id = p.posted_by
      LEFT JOIN likes AS l ON l.post = p.id
      LEFT JOIN comments AS c ON c.post = p.id
      WHERE p.id = ?;`;
      const [[postOwnerData]] = await conn.query(findPostOwner, [
        userId,
        postId,
        postId,
      ]);
      let result = {};
      result = {
        post: {
          id: postOwnerData.postId,
          created_at: postOwnerData.created_at,
          context: postOwnerData.context,
          is_liked: postOwnerData.is_liked,
          like_count: postOwnerData.like_count,
          comment_count: postOwnerData.comment_count,
          picture: postOwnerData.picture,
          name: postOwnerData.name,
          comments: [],
        },
      };
      if (postOwnerData.comment_count === 0) {
        result.post.comments = null;
        return result;
      }
      const findCmtAuthor = `
      SELECT c.id AS cmtId, DATE_FORMAT(c.created_at,"%Y-%m-%d %H:%i:%s") AS created_at, c.content,
      u.id AS userId, u.name, u.picture
      FROM users AS u
      INNER JOIN comments AS c ON u.id = c.author
      WHERE c.post = ?`;
      const [cmtAuthorData] = await conn.query(findCmtAuthor, [postId]);
      for (let i = 0; i < cmtAuthorData.length; i++) {
        const { cmtId, created_at, content, userId, name, picture } =
          cmtAuthorData[i];
        const obj = {
          id: cmtId,
          created_at,
          content,
          user: { id: userId, name, picture },
        };
        result.post.comments.push(obj);
      }
      return result;
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        throw errMsg.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  getMyTimeline: async (id, itemsPerQuery, cursor) => {
    const conn = await pool.getConnection();
    try {
      const friendStatus = 'friend';
      const getMyTimeline = `
      SELECT DISTINCT p.id, u.id AS user_id, 
      DATE_FORMAT(p.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, 
      p.context, 
      IF((SELECT COUNT(likes.post) FROM likes WHERE likes.post = p.id AND like_user = ?) > 0, true, false) AS is_liked,
      (SELECT COUNT(likes.id) FROM likes WHERE likes.post = p.id) AS like_count,
      (SELECT COUNT(comments.id) FROM comments WHERE comments.post = p.id) AS comment_count,
      u.picture, u.name
      FROM posts AS p
      LEFT JOIN users AS u ON p.posted_by = u.id 
      INNER JOIN (
                  SELECT users.id FROM users 
                  INNER JOIN friends ON users.id = friends.receiver_id 
                  WHERE friends.requester_id = ? AND friends.status = ?
                  UNION
                  SELECT users.id FROM users 
                  INNER JOIN friends ON users.id = friends.requester_id 
                  WHERE friends.receiver_id = ? AND friends.status = ?
                  UNION
                  SELECT users.id FROM users
                  WHERE users.id = ?
              ) AS my_friend_and_I
              ON my_friend_and_I.id = u.id
              LEFT JOIN comments ON p.id = comments.post
              LEFT JOIN likes ON p.id = likes.post
      WHERE p.id < ?
      ORDER BY p.id DESC
      LIMIT ?;`;
      const [myTimeline] = await conn.query(getMyTimeline, [
        id,
        id,
        friendStatus,
        id,
        friendStatus,
        id,
        cursor,
        itemsPerQuery,
      ]);
      return myTimeline;
    } catch (err) {
      console.log(err);
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
  getTimelineByUserId: async (myId, targetId, itemsPerQuery, cursor) => {
    const conn = await pool.getConnection();
    try {
      const checkUserExistence = 'SELECT id FROM users WHERE id = ?';
      const [userExistence] = await conn.query(checkUserExistence, [targetId]);
      if (userExistence.length === 0) {
        throw errMsg.generateMsg(403, 'User Not Found');
      }
      const getTimelineByUserId = `
          SELECT DISTINCT p.id, u.id AS user_id, 
          DATE_FORMAT(p.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, 
          p.context, 
          IF((SELECT COUNT(likes.post) FROM likes WHERE likes.post = p.id AND like_user = ?) > 0, true, false) AS is_liked,
          (SELECT COUNT(*) FROM likes WHERE likes.post = p.id) as like_count,  
          (SELECT COUNT(*) FROM comments WHERE comments.post = p.id) AS comment_count, 
          u.picture, u.name
          FROM posts AS p 
          INNER JOIN users AS u ON p.posted_by = u.id 
          LEFT JOIN comments ON p.id = comments.post
          LEFT JOIN likes ON p.id = likes.post
          WHERE u.id = ? AND p.id < ?
          ORDER BY p.id DESC
          LIMIT ?;`;
      const publicUserTimeline = await conn.query(getTimelineByUserId, [
        myId,
        targetId,
        cursor,
        itemsPerQuery,
      ]);
      return publicUserTimeline[0];
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        console.log(err);
        throw errMsg.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  countTotalPost: async () => {
    const conn = await pool.getConnection();
    try {
      const query = 'SELECT id FROM posts ORDER BY id DESC LIMIT 1;';
      const [[result]] = await conn.query(query);
      return result.id;
    } catch (err) {
      console.log(err);
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
};
