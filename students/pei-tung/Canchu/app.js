const express = require("express");
const mysql2 = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());

const db = mysql2.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

db.connect((err) => {
  if (err) {
    console.log(error);
  }
});

const salt = bcrypt.genSaltSync(10);

app.post("/api/1.0/users/signup", (req, res) => {
  try {
    // Check if every fields are filled
    const { name, email, password } = req.body;
    const provider = "native";
    const hashedPassword = bcrypt.hash(password, salt);

    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      password.trim().length === 0
    ) {
      return res.status(404).send("Sign Up Failed");
    }

    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          console.log("Error:", err.message);
          return res.status(500).send("Server Error Response");
        }
        if (result.length > 0) {
          // email already exists
          console.log(result);
          return res.status(403).send("Sign Up Failed");
        }
        db.query(
          "INSERT INTO users (name, email, password, provider) VALUES (?,?,?,?)",
          [name, email, password, provider],
          (err, result) => {
            console.log(provider, name, email, hashedPassword);
            if (err) {
              console.log("2");
              console.log("Error:", err.message);
              return res.status(500).send("Server Error Response");
            }
          }
        );
        db.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err, result) => {
            if (err) {
              console.log("Error:", err.message);
              return res.status(500).send("Server Error Response");
            }
            console.log(result);
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

app.listen(80, () => {
  console.log("Server started on port 80");
});
