// 只能一次跑 500 條，不然會輸入貼文的資料會有問題

const http = require('http');
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHJvdmlkZXIiOiJuYXRpdmUiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwibmFtZSI6InRlc3QiLCJwaWN0dXJlIjpudWxsLCJpYXQiOjE2OTE0MTY0MzZ9.zVyKuIy3W5kmU6HGdWUxV_0jz6IunAZcQcoovosEEqk`;
for (let i = 0; i < 500; i++) {
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
}
