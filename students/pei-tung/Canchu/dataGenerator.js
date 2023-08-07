const http = require('http');

for (let i = 0; i < 2; i++) {
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
      Authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYzLCJwcm92aWRlciI6Im5hdGl2ZSIsImVtYWlsIjoiZm94QGdtYWlsLmNvbSIsIm5hbWUiOiJmb3giLCJwaWN0dXJlIjoiaHR0cHM6Ly8xMy4yMTEuMTAuMTU0L3BpY3R1cmVzLzE2OTEyOTAzNTE2OTQtMTE0NjIuanBnIiwiaWF0IjoxNjkxMzc1MDkxfQ.z2JntCOKqDtt0gin0iBz1Zpr06IvZloRuWcYCvdE1co',
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
