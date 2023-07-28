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
      console.log(userId);
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
    // 'DELETE from users_groups WHERE id = ? AND creator = ?';
  },
  /* async(groupName, userid) => {
    const conn = await pool.getConnection();
    try{}catch(err){}finally{conn.release()}
  },*/
};
