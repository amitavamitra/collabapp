// Push for Heroku and CF in BTP
const path = require('path');
const http = require('http');
const ejs =  require('ejs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const request = require('request');
// const rfcClient = require("node-rfc").Client; removed for Heroku
require('dotenv').config();
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const messageTyping = require('./utils/usertyping');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server);

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));

app.set('view engine' , 'ejs');
const botName = 'ChatCord Bot';
const docElement = "";

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
//  user typing /?

  // When typing on matkx
socket.on('matkx',function(data){
    socket.broadcast.emit('matkx',data);
    console.log(data);
})

   // When typing on mbrsh
  socket.on('mbrsh',function(data){
    socket.broadcast.emit('mbrsh',data);
  })

     // When typing on matkl

     socket.on('matkl',function(data){
      socket.broadcast.emit('matkl',data);
    })

      // When typing on matyp

      socket.on('matyp',function(data){
        socket.broadcast.emit('matyp',data);
      })

      // When typing on meins
       socket.on('meins',function(data){
        socket.broadcast.emit('meins',data);
      })

      // When typing on freeze
      socket.on('freeze',function(data){
        socket.broadcast.emit('freeze',data);
      })

socket.on('typing', (data)=>{
  console.log(data)
  if(data.typing==true)
     io.emit('display', data)
     
  else
     io.emit('display', data)
})

    // Welcome current user
    socket.emit('welcome', formatMessage(botName, ''));

// Who is typing ?

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'welcome',
        formatMessage(botName, '')
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
    // console.log(matkx)
  });




  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'leaves',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});



app.post('/s4',function(req,res){
// would not work in heroku.
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

