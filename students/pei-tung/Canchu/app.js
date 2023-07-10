const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();

const app = express();

const userRoutes = require("./sever/routes/userRoutes");

app.use(express.json());
app.use("/api/1.0/users", userRoutes);
app.use(express.static("public"));

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

app.listen(80, () => {
  console.log("Server started on port 80");
});
