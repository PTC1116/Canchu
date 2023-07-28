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
  createGroup: async (groupName, userId) => {
    const conn = await pool.getConnection();
    try {
      const insertData = 'INSERT INTO user_groups (name, creator) VALUES (?,?)';
      const [result] = await conn.query(insertData, [groupName, userId]);
      const insertToMember = `INSERT INTO group_members (group_id, user_id,status) VALUES (?,?,'creator')`;
      await conn.query(insertToMember, [result.insertId, userId]);
      return result.insertId;
    } catch (err) {
      throw errMsg.dbError;
    } finally {
      conn.release();
    }
  },
  delGroup: async (groupId, userId) => {
    const conn = await pool.getConnection();
    try {
      const findGroup =
        'SELECT * from user_groups WHERE id = ? AND creator = ?';
      const [groupData] = await conn.query(findGroup, [groupId, userId]);
      if (groupData.length === 0) {
        throw errMsg.generateMsg(
          400,
          'Group Not Found OR You Do Not have Permission To Perform This Action',
        );
      }
      const deleteQuery =
        'DELETE from user_groups WHERE id = ? AND creator = ?';
      await conn.query(deleteQuery, [groupId, userId]);
      return groupId;
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
  joinGroup: async (groupId, userId) => {
    const conn = await pool.getConnection();
    try {
      const checkGroup = 'SELECT * from user_groups WHERE id = ?';
      const [groupStatus] = await conn.query(checkGroup, [groupId]);
      if (groupStatus.length === 0) {
        throw errMsg.generateMsg(400, 'Group Not Found');
      }
      const checkUserId =
        'SELECT * from user_groups WHERE id = ? AND creator = ?';
      const [result] = await conn.query(checkUserId, [groupId, userId]);
      if (result.length > 0) {
        throw errMsg.generateMsg(
          400,
          'You Do Not have Permission To Perform This Action',
        );
      }
      const checkMembers = `SELECT * from group_members WHERE group_id = ? AND user_id = ? AND status = 'member'`;
      const [member] = await conn.query(checkMembers, [groupId, userId]);
      if (member.length > 0) {
        throw errMsg.generateMsg(400, 'You Are Already a Member of This Group');
      }
      const checkUserStatus = `SELECT * from group_members WHERE group_id = ? AND user_id = ? AND status = 'pending'`;
      const [status] = await conn.query(checkUserStatus, [groupId, userId]);
      if (status.length > 0) {
        throw errMsg.generateMsg(400, 'Your Request Is Still Pending');
      }
      const insertMemberData = `INSERT INTO group_members (group_id, user_id,status) VALUES (?,?,'pending')`;
      await conn.query(insertMemberData, [groupId, userId]);
      return groupId;
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
  getPendingList: async (groupId, userId) => {
    const conn = await pool.getConnection();
    try {
      const checkUserStatus =
        'SELECT * FROM user_groups WHERE id = ? AND creator = ?';
      const [status] = await conn.query(checkUserStatus, [groupId, userId]);
      if (status.length === 0) {
        throw errMsg.generateMsg(
          400,
          'You Do Not have Permission To Perform This Action',
        );
      }
      const findPendingUser = `SELECT users.id AS id, name, picture, status 
        FROM users INNER JOIN group_members ON users.id = group_members.user_id 
        WHERE group_members.group_id = ? AND status = "pending";`;
      const [result] = await conn.query(findPendingUser, [groupId]);
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
  agreeJoinReq: async (groupId, userId, requesterId) => {
    const conn = await pool.getConnection();
    try {
      const checkUserStatus =
        'SELECT * FROM user_groups WHERE id = ? AND creator = ?';
      const [status] = await conn.query(checkUserStatus, [groupId, userId]);
      if (status.length === 0) {
        throw errMsg.generateMsg(
          400,
          'You Do Not have Permission To Perform This Action',
        );
      }
      const checkReqStatus = `SELECT * FROM group_members WHERE group_id = ? AND user_id = ? AND status = "pending"`;
      const [reqStatus] = await conn.query(checkReqStatus, [
        groupId,
        requesterId,
      ]);
      if (reqStatus.length === 0) {
        throw errMsg.generateMsg(400, 'Request Not Found');
      }
      const agreeReq = `UPDATE group_members SET status = "member" WHERE group_id = ? AND user_id = ?`;
      await conn.query(agreeReq, [groupId, requesterId]);
      return requesterId;
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
  post: async (groupId, userId, context) => {
    const conn = await pool.getConnection();
    try {
      const checkUserStatus = `
      SELECT id FROM group_members 
      WHERE (user_id = ? AND group_id = ? AND status = 'member') 
      OR (user_id = ? AND group_id = ? AND status = 'creator')`;
      const [userStatus] = await conn.query(checkUserStatus, [
        userId,
        groupId,
        userId,
        groupId,
      ]);
      if (userStatus.length === 0) {
        throw errMsg.generateMsg(
          400,
          'You Do Not have Permission To Perform This Action',
        );
      }
      const insertPost =
        'INSERT INTO group_posts (group_id, user_id,context,created_at) VALUES (?,?,?,now())';
      const [post] = await conn.query(insertPost, [groupId, userId, context]);
      return { groupId, userId, postId: post.insertId };
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
  getAllPosts: async (groupId, userId) => {
    const conn = await pool.getConnection();
    try {
      const checkUserStatus = `
      SELECT id FROM group_members 
      WHERE (user_id = ? AND group_id = ? AND status = 'member') 
      OR (user_id = ? AND group_id = ? AND status = 'creator')`;
      const [userStatus] = await conn.query(checkUserStatus, [
        userId,
        groupId,
        userId,
        groupId,
      ]);
      if (userStatus.length === 0) {
        throw errMsg.generateMsg(
          400,
          'You Do Not have Permission To Perform This Action',
        );
      }
      const getAllPost = `
      SELECT group_posts.id AS id, users.id AS user_id, 
      DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") AS created_at, context, picture, name 
      FROM users INNER JOIN group_posts ON users.id = group_posts.user_id 
      WHERE group_posts.group_id = ?
      ORDER BY group_posts.id DESC`;
      const [posts] = await conn.query(getAllPost, [groupId]);
      return posts;
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
    /*`SELECT group_posts.id AS id, users.id AS user_id, created_at, context, picture,name 
        FROM users INNER JOIN group_posts ON users.id = group_posts.user_id 
        WHERE group_posts.group_id = ?
        ORDER BY group_posts.id DESC
        ;`*/
    return 'all posts';
  },
  /* 
    const conn = await pool.getConnection();
    try{}catch(err){}finally{conn.release()
  },*/
};
