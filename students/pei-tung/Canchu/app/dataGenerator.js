/*const http = require('http');
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgzLCJwcm92aWRlciI6Im5hdGl2ZSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJuYW1lIjoidGVzdCIsInBpY3R1cmUiOm51bGwsImlhdCI6MTY5MTM5NDEwMH0.zFBG9TsttfIQUAQ5gxjlTGZvDKlvkHB6InboLjNtE6U`;
for (let i = 0; i < 50; i++) {
  const postData = JSON.stringify({
    context: '嗨',
  });

  const options = {
    hostname: '13.211.10.154',
    port: 80,
    path: '/api/1.0/posts',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `${token}`,
    },
  };

  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}*/
const mysql = require('mysql2');
const errMsg = require('./util/errorMessage');

const setPool = mysql.createPool({
  host: process.env.RDS_HOST,
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
const insert = async () => {
  const conn = await pool.getConnection();
  try {
    const insertData = `INSERT INTO posts (posted_by, context, created_at) VALUES ('183','嗨', now())`;
    await conn.query(insertData);
    console.log('insert success');
  } catch (err) {
    throw errMsg.dbError;
  } finally {
    await conn.release();
  }
};

for (let i = 0; i < 10; i++) {
  insert();
}
