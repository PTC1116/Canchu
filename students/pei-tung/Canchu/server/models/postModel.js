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
        "UPDATE posts SET context = ? WHERE id = ? AND posted_by = ?";
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
      // 確認該貼文是否存在
      const findTargetPost = "SELECT * FROM posts WHERE id = ?";
      const findResult = await conn.query(findTargetPost, [postId]);
      if (findResult[0].length === 0) {
        throw errMes.clientError;
      }
      // 查看該貼文是否已被該用戶按讚過
      const checkPostStatus =
        "SELECT * FROM likes WHERE like_user = ? AND post = ?";
      const checkResult = await conn.query(checkPostStatus, [userId, postId]);
      if (checkResult[0].length > 0) {
        throw errMes.clientError;
      }
      const insertData = `INSERT INTO likes(like_user, post)
        SELECT ?, ?
        WHERE NOT EXISTS (
            SELECT 1
            FROM likes
            WHERE like_user = ? AND post = ?
        );`;
      await conn.query(insertData, [userId, postId, userId, postId]);
      return postId;
    } catch (err) {
      if (err === errMes.clientError) {
        throw errMes.clientError;
      } else {
        console.log(err);
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
        "SELECT * FROM likes WHERE like_user = ? AND post = ?";
      const result = await conn.query(findTargetPost, [userId, postId]);
      if (result[0].length === 0) {
        throw errMes.clientError;
      }
      const deleteLike = "DELETE FROM likes WHERE like_user = ? AND post = ?";
      await conn.query(deleteLike, [userId, postId]);
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
  createComment: async (userId, postId, content) => {
    const conn = await pool.getConnection();
    try {
      // 確認該貼文是否存在
      const findTargetPost = "SELECT * FROM posts WHERE id = ?";
      const findResult = await conn.query(findTargetPost, [postId]);
      if (findResult[0].length === 0) {
        throw errMes.clientError;
      }
      const insertData =
        "INSERT INTO comments (author,post,content,created_at) VALUES (?,?,?,now())";
      const result = await conn.query(insertData, [userId, postId, content]);
      return result[0].insertId;
    } catch (err) {
      if (err === errMes.clientError) {
        throw errMes.clientError;
      } else {
        console.log(err);
        throw errMes.serverError;
      }
    } finally {
      await conn.release();
    }
  },
  getPostDetail: async (id) => {
    const conn = await pool.getConnection();
    try {
      // 確認該貼文是否存在
      const findTargetPost = "SELECT * FROM posts WHERE id = ?";
      const findResult = await conn.query(findTargetPost, [id]);
      if (findResult[0].length === 0) {
        throw errMes.clientError;
      }
      let result = {};
      const findPostOwner = `SELECT posts.id AS postId, posts.created_at, posts.context, users.picture, users.name 
      FROM users
      INNER JOIN posts ON users.id = posts.posted_by
      WHERE posts.id = ?`;
      const postOwnerData = await conn.query(findPostOwner, [id]);
      const countLike =
        "SELECT COUNT(*) AS totalLike FROM likes WHERE post = ?";
      const totalLike = await conn.query(countLike, [id]);
      const like_count = totalLike[0][0].totalLike;
      let is_liked = false;
      if (like_count > 0) {
        is_liked = true;
      }
      const countCmt =
        "SELECT COUNT (*) AS totalCmt FROM comments WHERE post = ?";
      const totalCmt = await conn.query(countCmt, [id]);
      const comment_count = totalCmt[0][0].totalCmt;
      result = {
        post: {
          id: postOwnerData[0][0].postId,
          created_at: postOwnerData[0][0].created_at,
          context: postOwnerData[0][0].context,
          is_liked,
          like_count,
          comment_count,
          picture: postOwnerData[0][0].picture,
          name: postOwnerData[0][0].name,
          comments: [],
        },
      };
      if (comment_count === 0) {
        result.post.comments = null;
        return result;
      }
      const findCmtAuthor = `SELECT comments.id AS cmtId, comments.created_at, comments.content, users.id AS userId, users.name, users.picture
      FROM users
      INNER JOIN comments
      ON users.id = comments.author
      WHERE comments.post = ?`;
      const cmtAuthorData = await conn.query(findCmtAuthor, [id]);
      // result.post.comments = [];
      for (let i = 0; i < cmtAuthorData[0].length; i++) {
        const { cmtId, created_at, content, userId, name, picture } =
          cmtAuthorData[0][i];
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
      if (err === errMes.clientError) {
        throw errMes.clientError;
      } else {
        console.log(err);
        throw errMes.serverError;
      }
    } finally {
      await conn.release();
    }
  },
  getMyTimeline: async (id, itemsPerPage, cursor) => {
    const conn = await pool.getConnection();
    try {
      const friendStatus = "friend";
      let getMyTimeline;
      if (!cursor) {
        console.log("nocursor");
        getMyTimeline = `SELECT DISTINCT posts.id, users.id AS user_id, posts.created_at, posts.context, IF ((SELECT COUNT(*) FROM likes WHERE likes.post = posts.id) > 0, true, false) AS is_liked, (SELECT COUNT(*) FROM likes WHERE likes.post = posts.id) as like_count,  (SELECT COUNT(*) FROM comments WHERE comments.post = posts.id) AS comment_count, users.picture, users.name
        FROM posts 
        LEFT JOIN users ON posts.posted_by = users.id 
        INNER JOIN 
        (
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
        ON my_friend_and_I.id = users.id
        LEFT JOIN comments ON posts.id = comments.post
        LEFT JOIN likes ON posts.id = likes.post
        LIMIT ?;`;
        const myTimeline = await conn.query(getMyTimeline, [
          id,
          friendStatus,
          id,
          friendStatus,
          id,
          itemsPerPage,
        ]);
        return myTimeline[0];
      } else {
        getMyTimeline = `SELECT * FROM
      (
          SELECT *, ROW_NUMBER() OVER (ORDER BY user_post.id DESC) as row_num
          FROM 
          (
              SELECT DISTINCT posts.id, users.id AS user_id, posts.created_at, posts.context, IF ((SELECT COUNT(*) FROM likes WHERE likes.post = posts.id) > 0, true, false) AS is_liked, (SELECT COUNT(*) FROM likes WHERE likes.post = posts.id) as like_count,  (SELECT COUNT(*) FROM comments WHERE comments.post = posts.id) AS comment_count, users.picture, users.name
              FROM posts 
              LEFT JOIN users ON posts.posted_by = users.id 
              INNER JOIN 
              (
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
              ON my_friend_and_I.id = users.id
              LEFT JOIN comments ON posts.id = comments.post
              LEFT JOIN likes ON posts.id = likes.post
          ) AS user_post
      ) AS numbered_my_timeline
      WHERE row_num > ?
      LIMIT ?;`;
      }
      const myTimeline = await conn.query(getMyTimeline, [
        id,
        friendStatus,
        id,
        friendStatus,
        id,
        cursor,
        itemsPerPage,
      ]);
      return myTimeline[0];
    } catch (err) {
      if (err === errMes.clientError) {
        throw errMes.clientError;
      } else {
        console.log(err);
        throw errMes.serverError;
      }
    } finally {
      await conn.release();
    }
  },
  getTimelineByUserId: async (id, itemsPerPage, cursor) => {
    const conn = await pool.getConnection();
    try {
      const checkUserExistence = "SELECT id FROM users WHERE id = ?";
      const userExistence = await conn.query(checkUserExistence, [id]);
      if (userExistence[0].length === 0) {
        throw errMes.clientError;
      }
      let getTimelineByUserId;
      if (!cursor) {
        getTimelineByUserId = `SELECT DISTINCT posts.id, users.id AS user_id, posts.created_at, posts.context, IF ((SELECT COUNT(*) FROM likes WHERE likes.post = posts.id) > 0, true, false) AS is_liked, (SELECT COUNT(*) FROM likes WHERE likes.post = posts.id) as like_count,  (SELECT COUNT(*) FROM comments WHERE comments.post = posts.id) AS comment_count, users.picture, users.name
          FROM posts 
          INNER JOIN users ON posts.posted_by = users.id 
          LEFT JOIN comments ON posts.id = comments.post
          LEFT JOIN likes ON posts.id = likes.post
          WHERE users.id = ?
          LIMIT = ?
      ;`;
        const publicUserTimeline = await conn.query(getTimelineByUserId, [
          id,
          itemsPerPage,
        ]);
        return publicUserTimeline[0];
      } else {
        getTimelineByUserId = `SELECT * FROM
      (SELECT *, ROW_NUMBER() OVER (ORDER BY user_post.id DESC) as row_num
        FROM 
        (SELECT DISTINCT posts.id, users.id AS user_id, posts.created_at, posts.context, IF ((SELECT COUNT(*) FROM likes WHERE likes.post = posts.id) > 0, true, false) AS is_liked, (SELECT COUNT(*) FROM likes WHERE likes.post = posts.id) as like_count,  (SELECT COUNT(*) FROM comments WHERE comments.post = posts.id) AS comment_count, users.picture, users.name
          FROM posts 
          INNER JOIN users ON posts.posted_by = users.id 
          LEFT JOIN comments ON posts.id = comments.post
          LEFT JOIN likes ON posts.id = likes.post
          WHERE users.id = ?
          ) AS user_post
        )AS numbered_public_timeline
      WHERE row_num > ?
      LIMIT ?;`;
      }
      const publicUserTimeline = await conn.query(getTimelineByUserId, [
        id,
        cursor,
        itemsPerPage,
      ]);
      return publicUserTimeline[0];
    } catch (err) {
      if (err === errMes.clientError) {
        throw errMes.clientError;
      } else {
        console.log(err);
        throw errMes.serverError;
      }
    } finally {
      await conn.release();
    }
  },
};
