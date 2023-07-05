const express = require("express");
const mysql2 = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();

const app = express();
const db = mysql2.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

app.use(express.json());

app.post("/users/signup", async (req, res) => {
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
      return res.status(404).send("Sign Up Failed");
    }

    db.query(
      "SELECT email FROM user WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          console.log("Error:", err.message);
          return res.status(500).send("Server Error Response");
        }
        if (result) {
          // email already exists
          return res.status(403).send("Sign Up Failed");
        } else {
          await db.query(
            "INSERT INTO user (provider, name, email, password) VALUES (?, ?, ?, ?)",
            [provider, name, email, hashedPassword],
            async (err, result) => {
              if (err) {
                console.log("Error:", err.message);
                return res.status(500).send("Server Error Response");
              } else {
                console.log("success");
              }
            }
          );
        }
        db.query(
          "SELECT * FROM your_table WHERE email = ?",
          [email],
          async (err, result) => {
            if (err) {
              console.log("Error:", err.message);
              return res.status(500).send("Server Error Response");
            }
            const { id, provider, name, email, picture } = result[0];
            const token = jwt.sign({ id }, process.env.JWT_KEY);
            const successRes = {
              data: {
                access_token: token, // JWT token,
                user: {
                  id: id,
                  provider: provider,
                  name: name,
                  email: email,
                  picture: picture,
                },
              },
            };
            return res.status(200).send(successRes);
          }
        );
      }
    );
  } catch (error) {
    console.log("error");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3600");
});
