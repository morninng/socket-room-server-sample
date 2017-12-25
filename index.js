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



const io = require('socket.io').listen(server);
io.sockets.setMaxListeners(Infinity);
const mixidea_io = io.of('/mixidea')


mixidea_io.on('connection',(socket_client)=>{
    console.log("connected to mixidea");
    socket_client.emit('connected');

    socket_client.on('join-room', (room_name) => {
        console.log('join-room called ', room_name)
        socket_client.join(room_name);
    })

    socket_client.on('disconnect', function(){
        console.log("disconnected socket id= " + socket_client.id);

    });
    

});

let count = 0;
const roomname_arr = ['room_a', 'room_b', 'room_c']

setInterval(()=>{
    count++;

    const number = count % roomname_arr.length;
    const room_name = roomname_arr[number];
    const message = 'message' + String(count);
    console.log(room_name + ' - ' + message);
    mixidea_io.to(room_name).emit('message', {room_name, message} );

}, 1000);



