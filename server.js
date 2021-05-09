// Push for Heroku and CF in BTP
const path = require('path');
const http = require('http');
const ejs =  require('ejs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const request = require('request');
const rfcClient = require("node-rfc").Client; 
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
  })

socket.on('typing', (data)=>{
  console.log(data)
  if(data.typing==true)
     io.emit('display', data)
     
  else
     io.emit('display', data)
})

    // Welcome current user
    socket.emit('message', formatMessage(botName, ''));

// Who is typing ?

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
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
        'message',
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
// On user approval - call S/4 via node-rfc
console.log('post method called')
  const abapConnection = {
    dest:'QJ9',
    user:process.env.UQJ9,
    passwd:process.env.PWD,
    ashost: process.env.AHOST1,
    sysnr: "00",
    client: "500",
  };
  
   
  // create new client
  const client = new rfcClient(abapConnection);

  // echo SAP NW RFC SDK and nodejs/RFC binding version
  console.log("Client version: ", client.version);
  
  // open connection
  client.connect(function(err) {
    
    if (err) {
      return console.error("could not connect to server",err);
    } else {
      console.log('Logged on to System:' + abapConnection.dest + " client " +abapConnection.client)
    }
  
    var timest = new Date().getUTCMinutes();
  
  //   // invoke ABAP function module, passing structure and table parameters
       
      const headdata = {
      MATERIAL        :       'text2ent' + timest,
      IND_SECTOR      :       "M",
      MATL_TYPE       :       "HALB",
      BASIC_VIEW      :       "X",
      MATERIAL_LONG   :      'text2ent' + timest
          };
  const clientdata  = {
      OLD_MAT_NO     :   'abcd',
      BASE_UOM       :    "EA",
      MATL_GROUP     :    "01"  
      };
  const clientdatax  = {
      OLD_MAT_NO     :    "X",
      BASE_UOM       :    "X" ,
      MATL_GROUP     :    "X"    
      };
  
  const    MATERIALDESCRIPTION = [{
  
      LANGU        :         "EN",
      LANGU_ISO    :          "EN",
      MATL_DESC    :        'abcd'
  
  }];
  
          client.invoke(
          "BAPI_MATERIAL_SAVEDATA",
          { HEADDATA: headdata ,
            CLIENTDATA: clientdata,
            CLIENTDATAX:clientdatax,
            MATERIALDESCRIPTION: MATERIALDESCRIPTION
           },
          function(err, res) {
              if (err) {
                  return console.error("Error invoking STFC_STRUCTURE:", err);
              }
              console.log("BAPI_MATERIAL_SAVEDATA call result:", res);
          }
      );
      
  });  // Dont comment this one..
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

