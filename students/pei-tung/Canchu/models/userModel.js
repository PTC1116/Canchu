const mysql = require("mysql2");

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
