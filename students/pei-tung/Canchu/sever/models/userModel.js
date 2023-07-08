const mysql = require("mysql2");
const errMes = require("../../util/errorMessage");

const pool = mysql.createPool({
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

module.exports = {
  signUp: async (name, email, password, provider) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          reject(errMes.severError);
        }
        conn.query(
          "SELECT email FROM users WHERE email = ?",
          [email],
          (err, result) => {
            if (err) {
              reject(errMes.severError);
            }
            if (result.length > 0) {
              reject({ error: "Sign Up Failed", status: 403 });
            }

            conn.query(
              "INSERT INTO users (name, email, password, provider) VALUES (?,?,?,?)",
              [name, email, password, provider],
              (err, result) => {
                if (err) {
                  reject(errMes.severError);
                }
              }
            );
            conn.query(
              "SELECT * FROM users WHERE email = ?",
              [email],
              (err, result) => {
                if (err) {
                  reject(errMes.severError);
                }
                resolve(result[0]);
              }
            );
          }
        );
        pool.releaseConnection(conn);
      });
    });
  },
  nativeSignIn: async (email, password) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          reject(errMes.severError);
        }
        conn.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err, result) => {
            if (err) {
              reject(errMes.severError);
            }
            if (result.length > 0 && result[0].password === password) {
              conn.query(
                "SELECT * FROM users WHERE email = ?",
                [email],
                (err, result) => {
                  if (err) {
                    reject(errMes.severError);
                  }
                  resolve(result[0]);
                }
              );
            } else {
              // invaild password and user name
              reject(errMes.signInFailed);
            }
          }
        );
        pool.releaseConnection(conn);
      });
    });
  },
  fbSignIn: async (name, email, provider) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("Error:", err.message);
          return res.status(500).send({ error: "Database Error Response" });
        }
        conn.query(
          "SELECT email FROM users WHERE email = ?",
          [email],
          (err, result) => {
            if (err) {
              reject(errMes.severError);
            }
            if (result.length > 0) {
              // data already exists
              conn.query(
                "SELECT * FROM users WHERE email = ?",
                [email],
                (err, result) => {
                  if (err) {
                    reject(errMes.severError);
                  }
                  resolve(result[0]);
                }
              );
            } else {
              conn.query(
                "INSERT INTO users (name, email, provider) VALUES (?,?,?)",
                [name, email, provider],
                (err, result) => {
                  if (err) {
                    reject(errMes.severError);
                  }
                  conn.query(
                    "SELECT * FROM users WHERE email = ?",
                    [email],
                    (err, result) => {
                      if (err) {
                        reject(errMes.severError);
                      }
                    }
                  );
                }
              );
            }
          }
        );
        pool.releaseConnection(conn);
      });
    });
  },
  userProfile: async (id) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          reject({ error: "Database Error Response" });
        }
        conn.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
          if (err) {
            reject({ error: "Server Error Response" });
          }
          resolve(result[0]);
        });
        pool.releaseConnection(conn);
      });
    });
  },
  userPictureUpdate: async (id, path) => {
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
  },
  userProfileUpdate: async (name, intro, tags, id) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          reject({ error: "Database Error Response" });
        }
        conn.query(
          "UPDATE users SET name = ?, introduction = ?, tags = ? WHERE id = ?",
          [name, intro, tags, id],
          (err, result) => {
            if (err) {
              reject({ error: "Database Error Response" });
            }
            resolve(id);
          }
        );
      });
    });
  },
};

/*module.exports.userProfile = () => {
  return "3";
};*/
// 也可以 module.exports{ a: function()=>{}, b:function() => {module.exports.a()}}
