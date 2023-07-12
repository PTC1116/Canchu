const mysql = require("mysql2");
const errMes = require("../../util/errorMessage");
const bcrypt = require("bcryptjs");

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
  signUp: async (name, email, password, provider) => {
    const conn = await pool.getConnection();
    try {
      const emailQuery = "SELECT email FROM users WHERE email = ?";
      const emailResult = await conn.query(emailQuery, [email]);
      if (emailResult[0].length > 0) {
        throw errMes.signUpFailed;
      }
      const insertDataQuery =
        "INSERT INTO users (name, email, password, provider) VALUES (?,?,?,?)";
      await conn.query(insertDataQuery, [name, email, password, provider]);
      const getUserByEmail = "SELECT * FROM users WHERE email = ?";
      const result = await conn.query(getUserByEmail, [email]);
      return result[0][0];
    } catch (err) {
      if (err === errMes.signUpFailed) {
        throw errMes.signUpFailed;
      } else {
        throw errMes.serverError;
      }
    } finally {
      conn.release();
    }
  },
  nativeSignIn: async (email, password) => {
    const conn = await pool.getConnection();
    try {
      const getUserByEmail = "SELECT * FROM users WHERE email = ?";
      const result = await conn.query(getUserByEmail, [email]);
      if (result[0].length === 0) {
        throw errMes.signInFailed;
      }
      const passwordCheck = await bcrypt.compare(
        password,
        result[0][0].password
      );
      if (passwordCheck) {
        const getUserByEmail = "SELECT * FROM users WHERE email = ?";
        const result = await conn.query(getUserByEmail, [email]);
        return result[0][0];
      } else {
        throw errMes.signInFailed;
      }
    } catch (err) {
      if (err === errMes.signInFailed) {
        throw errMes.signInFailed;
      } else {
        throw errMes.serverError;
      }
    } finally {
      await conn.release();
    }
  },
  fbSignIn: async (name, email, provider) => {
    const conn = await pool.getConnection();
    try {
      const emailQuery = "SELECT email FROM users WHERE email = ?";
      const result = await conn.query(emailQuery, [email]);
      if (!(result[0].length > 0)) {
        const insertDataQuery =
          "INSERT INTO users (name, email, provider) VALUES (?,?,?)";
        const insertDataResult = await conn.query(insertDataQuery, [
          name,
          email,
          provider,
        ]);
      }
      const getUserByEmail = "SELECT * FROM users WHERE email = ?";
      const userDataResult = await conn.query(getUserByEmail, [email]);
      return userDataResult[0][0];
    } catch (err) {
      throw errMes.serverError;
    } finally {
      await conn.release();
    }
  },
  userProfile: async (id) => {
    const conn = await pool.getConnection();
    try {
      const getUserById = "SELECT * FROM users WHERE id = ?";
      const result = await conn.query(getUserById, [id]);
      return result[0][0];
    } catch {
      throw errMes.serverError;
    } finally {
      await conn.release();
    }
  },
  userPictureUpdate: async (id, path) => {
    const conn = await pool.getConnection();
    try {
      const updatedPicById = "UPDATE users SET picture = ? WHERE id = ?";
      const result = await conn.query(updatedPicById, [path, id]);
      return path;
    } catch (err) {
      throw errMes.serverError;
    } finally {
      await conn.release();
    }
  },
  userProfileUpdate: async (name, intro, tags, id) => {
    const conn = await pool.getConnection();
    try {
      const insertData =
        "UPDATE users SET name = ?, introduction = ?, tags = ? WHERE id = ?";
      await conn.query(insertData, [name, intro, tags, id]);
      return id;
    } catch (err) {
      throw errMes.serverError;
    } finally {
      await conn.release();
    }
  },
  search: async (myId, keyword) => {
    const conn = await pool.getConnection();
    try {
      // Find target users
      const findId = "SELECT id FROM users WHERE name like ?";
      const keywordStr = `%${keyword}%`;
      const findRelationship = `SELECT users.id AS userId, name, picture, friends.id, friends.receiver_id, friends.status 
      FROM users
      INNER JOIN friends ON users.id = friends.receiver_id
      WHERE name like ? AND requester_id = ?
      UNION
      SELECT users.id AS userId, name, picture, friends.id, friends.receiver_id, friends.status
      FROM users
      INNER JOIN friends ON users.id = friends.requester_id
      WHERE name like ? AND receiver_id = ?;`;
      const result = await conn.query(findRelationship, [
        keywordStr,
        myId,
        keywordStr,
        myId,
      ]);
      for (i = 0; i < result[0].length; i++) {
        if (
          result[0][i].receiver_id === myId &&
          result[0][i].status === "requested"
        ) {
          result[0][i].status = pending;
        }
      }
      return result[0];
    } catch (err) {
      throw err;
    } finally {
      await conn.release();
    }
  },
};

// 也可以 module.exports{ a: function()=>{}, b:function() => {module.exports.a()}}
