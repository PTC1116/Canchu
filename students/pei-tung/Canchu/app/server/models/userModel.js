const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const errMsg = require('../../util/errorMessage');

const setPool = mysql.createPool({
  //host: process.env.DATABASE_HOST,
  host: 'mysql_container',
  user: process.env.DATABASE_USER,
  //database: process.env.DATABASE_NAME,
  database:
    process.env.NODE_ENV === 'test' ? 'Canchu_Test' : process.env.DATABASE_NAME,
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
  signUp: async (name, email, password, provider) => {
    const conn = await pool.getConnection();
    try {
      const checkEmailRegistration = 'SELECT email FROM users WHERE email = ?';
      const [duplicateEmail] = await conn.query(checkEmailRegistration, [
        email,
      ]);
      if (duplicateEmail.length > 0) {
        throw errMsg.generateMsg(403, 'Sign Up Failed: Email Already Taken');
      }
      const insertUserData =
        'INSERT INTO users (name, email, password, provider) VALUES (?,?,?,?)';
      await conn.query(insertUserData, [name, email, password, provider]);
      const getUserByEmail = 'SELECT * FROM users WHERE email = ?';
      const [[userData]] = await conn.query(getUserByEmail, [email]);
      return userData;
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        console.log(err);
        throw errMsg.dbError;
      }
    } finally {
      conn.release();
    }
  },
  nativeSignIn: async (email, password) => {
    const conn = await pool.getConnection();
    try {
      const findPasswordByEmail = 'SELECT password FROM users WHERE email = ?';
      const [userPassword] = await conn.query(findPasswordByEmail, [email]);
      if (userPassword.length === 0) {
        throw errMsg.generateMsg(403, 'Sign In Failed: Invalid Email');
      }
      const checkPassword = await bcrypt.compare(
        password,
        userPassword[0].password,
      );
      if (checkPassword) {
        const getUserDataByEmail = 'SELECT * FROM users WHERE email = ?';
        const [[result]] = await conn.query(getUserDataByEmail, [email]);
        return result;
      } else {
        throw errMsg.generateMsg(403, 'Sign In Failed: Wrong Password');
      }
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
  fbSignIn: async (name, email, provider) => {
    const conn = await pool.getConnection();
    try {
      const checkUserExistenceByEmail =
        'SELECT email FROM users WHERE email = ?';
      const [result] = await conn.query(checkUserExistenceByEmail, [email]);
      if (result.length === 0) {
        const insertData =
          'INSERT INTO users (name, email, provider) VALUES (?,?,?)';
        await conn.query(insertData, [name, email, provider]);
      }
      const getUserDataByEmail = 'SELECT * FROM users WHERE email = ?';
      const [[userDataResult]] = await conn.query(getUserDataByEmail, [email]);
      return userDataResult;
    } catch (err) {
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
  checkUserExistenceById: async (conn, id) => {
    const findUserById = 'SELECT id FROM users WHERE id = ?';
    const [result] = await conn.query(findUserById, [id]);
    if (result.length === 0) {
      return false;
    } else {
      return true;
    }
  },
  userProfile: async (myId, targetId) => {
    const conn = await pool.getConnection();
    try {
      const userExistence = await module.exports.checkUserExistenceById(
        conn,
        targetId,
      );
      if (!userExistence) {
        throw errMsg.generateMsg(403, 'User Not Found');
      }
      const getUserDataById =
        'SELECT id, name, picture, introduction, tags FROM users WHERE id = ?';
      const [result] = await conn.query(getUserDataById, [targetId]);
      const friendStatus = 'friend';
      const countAllFriends = `SELECT COUNT(id) AS friendCount FROM friends 
        WHERE (requester_id = ? AND status = ?) 
        OR (receiver_id = ? AND status = ?)`;
      const [[friendCount]] = await conn.query(countAllFriends, [
        targetId,
        friendStatus,
        targetId,
        friendStatus,
      ]);
      result[0].friend_count = friendCount.friendCount;
      const findFriendshipStatus = `SELECT id, receiver_id, status FROM friends
      WHERE (requester_id = ? AND receiver_id = ?) 
      OR (requester_id = ? AND receiver_id = ?)`;
      const [friendshipStatus] = await conn.query(findFriendshipStatus, [
        myId,
        targetId,
        targetId,
        myId,
      ]);
      if (friendshipStatus.length === 0) {
        result[0].friendship = null;
      } else if (
        friendshipStatus[0].receiver_id === myId &&
        friendshipStatus[0].status === 'requested'
      ) {
        result[0].friendship = {
          id: friendshipStatus[0].id,
          status: 'pending',
        };
      } else {
        result[0].friendship = {
          id: friendshipStatus[0].id,
          status: friendshipStatus[0].status,
        };
      }
      return result[0];
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
  userPictureUpdate: async (id, picName) => {
    const conn = await pool.getConnection();
    try {
      const userExistence = await module.exports.checkUserExistenceById(
        conn,
        id,
      );
      if (!userExistence) {
        throw errMsg.generateMsg(403, 'User Not Found');
      }
      const myIp = '13.211.10.154';
      const picUrl = `https://${myIp}/pictures/${picName}`;
      const updatedPicById = 'UPDATE users SET picture = ? WHERE id = ?';
      await conn.query(updatedPicById, [picUrl, id]);
      return picUrl;
    } catch (err) {
      if (err.status === 403) {
        throw err;
      } else {
        console.log('?');
        throw errMsg.dbError;
      }
    } finally {
      await conn.release();
    }
  },
  userProfileUpdate: async (name, intro, tags, id) => {
    const conn = await pool.getConnection();
    try {
      const userExistence = await module.exports.checkUserExistenceById(
        conn,
        id,
      );
      if (!userExistence) {
        throw errMsg.generateMsg(403, 'User Not Found');
      }
      const insertData =
        'UPDATE users SET name = ?, introduction = ?, tags = ? WHERE id = ?';
      await conn.query(insertData, [name, intro, tags, id]);
      return id;
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
  search: async (myId, keyword) => {
    const conn = await pool.getConnection();
    try {
      const keywordStr = `%${keyword}%`;
      const findUsers = `
      SELECT users.id AS userId, name, picture, friends.id, 
      friends.requester_id, friends.receiver_id, friends.status
      FROM users
      LEFT JOIN friends ON (users.id = friends.receiver_id AND requester_id = ?) 
      OR (users.id = friends.requester_id AND receiver_id =?)
      WHERE name like ?;`;
      const [result] = await conn.query(findUsers, [myId, myId, keywordStr]);
      for (let i = 0; i < result.length; i++) {
        if (result[i].receiver_id !== myId && result[i].requester_id !== myId) {
          result[i].id = null;
          result[i].status = null;
        }
        if (
          result[i].receiver_id === myId &&
          result[i].status === 'requested'
        ) {
          result[i].status = 'pending';
        }
      }
      return result;
    } catch (err) {
      throw errMsg.dbError;
    } finally {
      await conn.release();
    }
  },
};

// 也可以 module.exports{ a: function()=>{}, b:function() => {module.exports.a()}}
