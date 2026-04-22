import http from 'http';

http.get('http://0.0.0.0:3000/article/123/title', (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response Body:', data.substring(0, 200) + '...');
  });
}).on('error', err => {
  console.error('Error:', err.message);
});
