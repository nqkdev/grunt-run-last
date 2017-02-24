const server = require('http').createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Hello World\n');
});

server.listen(8001, '127.0.0.1', () => {
  console.log('app1.js running at http://127.0.0.1:8001/', process.pid);
});
