const mysql = require('mysql2');
const errMsg = require('../../util/errorMessage');
const { agree } = require('./friendModel');

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
      const checkUserId =
        'SELECT * from user_groups WHERE id = ? AND creator = ?';
      const [result] = await conn.query(checkUserId, [groupId, userId]);
      if (result.length > 0) {
        throw errMsg.generateMsg(
          400,
          'You Do Not have Permission To Perform This Action',
        );
      }
      const checkUserStatus =
        'SELECT * from group_members WHERE group_id = ? AND user_id = ?';
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
  /*post: async (userId, groupid, context) => {
    const conn = await pool.getConnection();
    try {
      const checkUserStatus = `'SELECT id FROM group_members WHERE (user_id = ? AND status = 'member') OR (user_id = ? AND status = 'creator')`;
    } catch (err) {
    } finally {
      conn.release();
    }
  },*/
  /* 
    const conn = await pool.getConnection();
    try{}catch(err){}finally{conn.release()
  },*/
};
