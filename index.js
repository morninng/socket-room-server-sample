const express = require('express')
const app = express();
const http = require('http');
const PubNub = require('pubnub');

const pubnub = new PubNub({
    subscribeKey: "sub-c-1790666a-e0ae-11e7-8b5d-3e564a31a465",
    publishKey: "pub-c-b7322b72-a22e-4d52-9e1f-b2e40c1c5422",
    secretKey: "sec-c-NmU4YTA3NDgtZWFlOS00YzljLTllNzktNDVkNjkwZWE1Njdl",
    ssl: true
})

pubnub.addListener({   
    message: function(m) {
        // console.log(m);
        // handle message
        const actualChannel = m.actualChannel;
        const channelName = m.channel; // The channel for which the message belongs
        const msg = m.message; // The Payload
        const publisher = m.publisher;
        const subscribedChannel = m.subscribedChannel;
        const channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        const pubTT = m.timetoken; // Publish timetoken

        publish_message_to_client(channelName, msg)
    }
});

pubnub.subscribe({
    channels: ['aaa', 'bbb', 'ccc', 'ddd']
});



function publish_message_to_client(channelName, msg) {
    console.log('Channel:' +  channelName + ' - msg: ' + msg);
    mixidea_io.to(channelName).emit('message', {room_name: channelName, message: msg} );
}



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
    check_numberof_clients();
    console.log("connected to mixidea");
    socket_client.emit('connected');

    socket_client.on('join-room', (room_name) => {
        console.log('join-room called ', room_name)
        socket_client.join(room_name);
    })

    socket_client.on('leave-room', (room_name) => {
        console.log('leave-room called ', room_name)
        socket_client.leave(room_name);
    })

    socket_client.on('leave-all', (dummy) => {
        console.log('leave-room all ')
        socket_client.leaveAll();
    })

    socket_client.on('disconnect', function(){
        console.log("disconnected socket id= " + socket_client.id);
        check_numberof_clients();
    });
});


function check_numberof_clients() {

    mixidea_io.clients((err, clients)=>{
        const connected_client_number = clients.length;
        console.log('connected_client_number', connected_client_number);
    })
}


// let count = 0;
// const roomname_arr = ['room_a', 'room_b', 'room_c']

// setInterval(()=>{
//     count++;

//     const number = count % roomname_arr.length;
//     const room_name = roomname_arr[number];
//     const message = 'message' + String(count);
//     console.log(room_name + ' - ' + message);
//     mixidea_io.to(room_name).emit('message', {room_name, message} );

// }, 1000);



