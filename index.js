const express = require('express')
const app = express();
const http = require('http');



 const serverPort = 3000;
// const serverPort = 80;
const serverHost = "127.0.0.1";

const httpServer = http.createServer(app);
const server = httpServer.listen(serverPort,  serverHost, ()=> {
//   const server = httpServer.listen(serverPort, /* serverHost,*/ ()=> {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
})



// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
});


