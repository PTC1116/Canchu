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
  createGroup: async (groupName, userid) => {
    const conn = await pool.getConnection();
    try {
      const insertData = 'INSERT INTO user_groups (name, creator) VALUES (?,?)';
      const [result] = await conn.query(insertData, [groupName, userid]);
      return result.insertId;
    } catch (err) {
      throw errMsg.dbError;
    } finally {
      conn.release();
    }
  },
  /* async(groupName, userid) => {
    const conn = await pool.getConnection();
    try{}catch(err){}finally{conn.release()}
    
    return 'create group';
  },*/
};
