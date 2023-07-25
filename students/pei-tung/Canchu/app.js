const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();
const userRoutes = require('./server/routes/userRoute');
const friendRoutes = require('./server/routes/friendRoute');
const eventRoutes = require('./server/routes/eventRoutes');
const postRoutes = require('./server/routes/postRoutes');

app.set('trust proxy', true);
app.use('/api/1.0/*', (req, res, next) => {
  console.log(req.header);
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`Your IP address is: ${clientIP}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/1.0/users', userRoutes);
app.use('/api/1.0/friends', friendRoutes);
app.use('/api/1.0/events', eventRoutes);
app.use('/api/1.0/posts', postRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
