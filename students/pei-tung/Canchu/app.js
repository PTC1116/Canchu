const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const salt = bcrypt.genSaltSync(10);

app.post("/api/1.0/users/signup", async (req, res) => {
  try {
    // Check if every fields are filled
    const { name, email, password } = req.body;
    const provider = "native";
    const hashedPassword = await bcrypt.hash(password, salt);

    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      password.trim().length === 0
    ) {
      return res.status(404).send("Sign Up Failed");
    }
    pool.getConnection((err, conn) => {
      if (err) {
        console.log("Error:", err.message);
        return res.status(500).send("Database Error Response");
      }
      conn.query(
        "SELECT email FROM users WHERE email = ?",
        [email],
        (err, result) => {
          if (err) {
            console.log("Error:", err.message);
            return res.status(500).send({ error: "Server Error Response" });
          }
          if (result.length > 0) {
            // email already exists
            console.log(result);
            return res.status(403).send({ error: "Sign Up Failed" });
          }

          conn.query(
            "INSERT INTO users (name, email, password, provider) VALUES (?,?,?,?)",
            [name, email, password, provider],
            (err, result) => {
              if (err) {
                console.log("Error:", err.message);
                return res.status(500).send({ error: "Server Error Response" });
              }
            }
          );
          conn.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, result) => {
              if (err) {
                console.log("Error:", err.message);
                return res.status(500).send({ error: "Server Error Response" });
              }
              const { id, provider, name, email, picture } = result[0];
              const token = jwt.sign({ id }, process.env.JWT_KEY);
              const successRes = {
                data: {
                  access_token: token, // JWT token,
                  user: {
                    id: id,
                    name: name,
                    email: email,
                    provider: provider,
                    picture: picture,
                  },
                },
              };
              return res.status(200).send(successRes);
            }
          );
        }
      );
      pool.releaseConnection(conn);
    });
  } catch (error) {
    console.log("error");
  }
});

app.listen(80, () => {
  console.log("Server started on port 80");
});
