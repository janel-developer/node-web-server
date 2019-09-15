const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// When we create an http server, we pass it a callback function that performs the actions of the server
const server = http.createServer((req, res) => {
  res.statusCode = 200 // status code
  res.setHeader("Content-Type", "text/plain") // header
  res.end("Hello World") // body
})


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
});