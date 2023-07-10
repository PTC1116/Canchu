const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();

const app = express();

const userRoutes = require("./server/routes/userRoutes");
const friendRoutes = require("./server/routes/friendRoutes");
app.use(express.json());
app.use("/api/1.0/users", userRoutes);
app.use("/api/1.0/friends", friendRoutes);

app.listen(80, () => {
  console.log("Server started on port 80");
});
