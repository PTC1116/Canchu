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
      const insertDataResult = await conn.query(insertDataQuery, [
        name,
        email,
        password,
        provider,
      ]);
      const getUserByEmail = "SELECT * FROM users WHERE email = ?";
      const result = await conn.query(getUserByEmail, [email]);
      return result[0][0];
    } catch (err) {
      if (err === errMes.signUpFailed) {
        throw errMes.signUpFailed;
      } else {
        throw errMes.severError;
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
        throw errMes.severError;
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
      throw errMes.severError;
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
      throw errMes.severError;
    } finally {
      await conn.release();
    }
  },
  /*userPictureUpdate: async (id, path) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          reject({ error: "Database Error Response" });
        }
        conn.query(
          "UPDATE users SET picture = ? WHERE id = ?",
          [path, id],
          (err, result) => {
            if (err) {
              reject({ error: "Database Error Response" });
            }
            resolve(path);
          }
        );
      });
    });
  }*/
  userPictureUpdate: async (id, path) => {
    const conn = await pool.getConnection();
    try {
      const updatedPicById = "UPDATE users SET picture = ? WHERE id = ?";
      const result = await conn.query(updatedPicById, [path, id]);
      return path;
    } catch (err) {
      throw errMes.severError;
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
      throw errMes.severError;
    } finally {
      await conn.release();
    }
  },
};

// 也可以 module.exports{ a: function()=>{}, b:function() => {module.exports.a()}}
