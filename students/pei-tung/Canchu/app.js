const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();

const app = express();

const userRoutes = require("./sever/routes/userRoutes");

app.use(express.json());
app.use("/api/1.0/users", userRoutes);

// Connect My SQL
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

// signup
/* app.post("/api/1.0/users/signup", async (req, res) => {
  try {
    // Check if every fields are filled
    const { name, email, password } = req.body;
    const provider = "native";
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      password.trim().length === 0
    ) {
      return res.status(400).send("Sign Up Failed");
    }
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
            console.log("Error:", err.message);
            return res.status(500).send({ error: "Server Error Response" });
          }
          if (result.length > 0) {
            // email already exists
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
              const user = {
                id: id,
                name: name,
                email: email,
                provider: provider,
                picture: picture,
              };
              const token = jwt.sign(user, process.env.JWT_KEY);
              const successRes = {
                data: {
                  access_token: token,
                  user: user,
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
}); */

// SignIn
/*app.post("/api/1.0/users/signin", (req, res) => {
  try {
    const { provider, email, password } = req.body;
    if (provider === "native" && Object.keys(req.body).length !== 3) {
      return res.status(400).send({ error: "Client Error Response" });
    }
    if (provider === "native") {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("Error:", err.message);
          return res.status(500).send({ error: "Database Error Response" });
        }
        conn.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err, result) => {
            if (err) {
              console.log("Error:", err.message);
              return res.status(500).send({ error: "Server Error Response" });
            }
            console.log(result);
            if (result.length > 0 && result[0].password === password) {
              conn.query(
                "SELECT * FROM users WHERE email = ?",
                [email],
                (err, result) => {
                  if (err) {
                    console.log("Error:", err.message);
                    return res
                      .status(500)
                      .send({ error: "Server Error Response" });
                  }
                  const { id, provider, name, email, picture } = result[0];
                  const user = {
                    id: id,
                    name: name,
                    email: email,
                    provider: provider,
                    picture: picture,
                  };
                  const token = jwt.sign(user, process.env.JWT_KEY);
                  const successRes = {
                    data: {
                      access_token: token,
                      user: user,
                    },
                  };
                  return res.status(200).send(successRes);
                }
              );
            } else {
              // invaild password and user name
              return res.status(403).send({ error: "Sign in Failed" });
            }
          }
        );
        pool.releaseConnection(conn);
      });
    } else if (provider === "facebook") {
      console.log(req.body.access_token);
      const accessToken = req.body.access_token;
      axios
        .get(
          `https://graph.facebook.com/v13.0/me?fields=id,name,email&access_token=${accessToken}`
        )
        .then((response) => {
          const { id, name, email } = response.data;
          const provider = "facebook";
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
                  console.log("Error:", err.message);
                  return res
                    .status(500)
                    .send({ error: "Server Error Response" });
                }
                if (result.length > 0) {
                  // data already exists
                  conn.query(
                    "SELECT * FROM users WHERE email = ?",
                    [email],
                    (err, result) => {
                      if (err) {
                        console.log("Error:", err.message);
                        return res
                          .status(500)
                          .send({ error: "Server Error Response" });
                      }
                      const { id, provider, name, email, picture } = result[0];
                      const user = {
                        id: id,
                        name: name,
                        email: email,
                        provider: provider,
                        picture: picture,
                      };
                      const token = jwt.sign(user, process.env.JWT_KEY);
                      const successRes = {
                        data: {
                          access_token: token,
                          user: user,
                        },
                      };
                      return res.status(200).send(successRes);
                    }
                  );
                } else {
                  conn.query(
                    "INSERT INTO users (name, email, provider) VALUES (?,?,?)",
                    [name, email, provider],
                    (err, result) => {
                      if (err) {
                        console.log("Error:", err.message);
                        return res
                          .status(500)
                          .send({ error: "Server Error Response" });
                      }
                      conn.query(
                        "SELECT * FROM users WHERE email = ?",
                        [email],
                        (err, result) => {
                          if (err) {
                            console.log("Error:", err.message);
                            return res
                              .status(500)
                              .send({ error: "Server Error Response" });
                          }
                          const { id, provider, name, email, picture } =
                            result[0];
                          const user = {
                            id: id,
                            name: name,
                            email: email,
                            provider: provider,
                            picture: picture,
                          };
                          const token = jwt.sign(user, process.env.JWT_KEY);
                          const successRes = {
                            data: {
                              access_token: token,
                              user: user,
                            },
                          };
                          return res.status(200).send(successRes);
                        }
                      );
                    }
                  );
                }
              }
            );

            pool.releaseConnection(conn);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      return res.status(403).send({ error: "Sign In Failed" });
    }
  } catch (err) {
    console.log(err);
  }
});*/

app.listen(80, () => {
  console.log("Server started on port 80");
});
