const chatForm = document.getElementById('mat-form');
const chatMessages = document.querySelector('.form-control');
const roomName = document.getElementById('room-name');
var  docActiveElement = document.activeElement.name;
const userList = document.getElementById('users');
var matkx =  document.getElementById('matkx');
var matkx_user =  document.getElementById('matkx_user');
var mbrsh =  document.getElementById('mbrsh');
var mbrsh_user =  document.getElementById('mbrsh_user');
var matkl =  document.getElementById('matkl');
var matkl_user =  document.getElementById('matkl_user');
var matyp =  document.getElementById('matyp');
var matyp_user =  document.getElementById('matyp_user');
var meins =  document.getElementById('meins');
var meins_user =  document.getElementById('meins_user');
var freeze = document.getElementById('freeze');
var freeze_user = document.getElementById('freeze_user');
var utyping = document.getElementById('username');

var timeout=undefined;
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
var keyCode = "";
// Join chatroom
socket.emit('joinRoom', { username, room });
document.getElementById('username').value = username;
// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  // console.log(message);
  outputMessage(message);
});

// Message from server
socket.on('typing', (data) => {
  // console.log(data);
  userTyping(data);
});

// Output message to DOM
function userTyping(data) {
  console.log(data)
}

// Listen for events

//  1.When user is typing

//  2. When emit button is pressed 

//  KeyDown Event start

//  When user is working on  Matkx
matkx.addEventListener('keypress',function(){
  socket.emit('matkx',utyping)
})
socket.on('matkx',function(data){
matkx_user.innerHTML = data.value + ' is typing...';
matkx_user.style.backgroundColor = 'lightblue';
})

//  When user is working on  mbrsh
mbrsh.addEventListener('mousedown',function(){
  socket.emit('mbrsh',utyping)
  clearTimeout(timeout)
  timeout=setTimeout(1500)
})
socket.on('mbrsh',function(data){
mbrsh_user.innerHTML = data.value + ' is typing';
mbrsh_user.style.backgroundColor = 'lightblue';

})

//  When user is working on  matkl
matkl.addEventListener('mousedown',function(){
  socket.emit('matkl',utyping)
  clearTimeout(timeout)
  timeout=setTimeout(1500)
})
socket.on('matkl',function(data){
matkl_user.innerHTML = data.value + ' is typing';
matkl_user.style.backgroundColor = 'lightblue';

})

//  When user is working on  matyp
matyp.addEventListener('mousedown',function(){
  socket.emit('matyp',utyping)
  clearTimeout(timeout)
  timeout=setTimeout(1500)
})
socket.on('matyp',function(data){
matyp_user.innerHTML = data.value + ' is typing';
matyp_user.style.backgroundColor = 'lightblue';

})

//  When user is working on  meins
meins.addEventListener('mousedown',function(){
  socket.emit('meins',utyping)
  clearTimeout(timeout)
  timeout=setTimeout(1500)
})
socket.on('meins',function(data){
meins_user.innerHTML = data.value + ' is typing';
meins_user.style.backgroundColor = 'lightblue';

})

//  When user is working on  freeze
freeze.addEventListener('mousedown',function(){
  socket.emit('freeze',{utyping: utyping,freeze:freeze.checked})
  clearTimeout(timeout)
  timeout=setTimeout(1500)
})
socket.on('freeze',function(data){
  console.log(data.freeze)
   if (data.freeze == true) {
    freeze_user.innerHTML = data.utyping.value + ' is working...';
    freeze_user.style.backgroundColor = 'lightblue';
   
  } 
  if (data.freeze == false){
    freeze_user.innerHTML = data.utyping.value + ' has agreed';
    freeze_user.style.backgroundColor = 'lightgreen';
  }
})

chatForm.addEventListener('keydown', (e) => {
  if (e.isComposing) {
  typing=true
  socket.emit('typing', {user:username,typing:true ,keypressed:e.keyCode , docElement:document.activeElement.name})
  clearTimeout(timeout)
  timeout=setTimeout(typingTimeout, 1500)
 
}
else{
  clearTimeout(timeout)
  typingTimeout()
  // sendMessage()
}

function typingTimeout(){
  var user = "";
  typing=false
  socket.emit('typing', {user:username,typing:true ,keypressed:e.keyCode , docElement:document.activeElement.name})
  console.log(String.fromCharCode(keyCode))
 
}

  
  });
//  KeyDown Event End

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let matkx = e.target.elements.matkx.value;
  let mbrsh = e.target.elements.mbrsh.value;
  let matkl = e.target.elements.matkl.value;
  let matyp = e.target.elements.matyp.value;
  let meins = e.target.elements.meins.value;

  let msg = [];
  msg.push(matkx);
  msg.push(mbrsh); 
  msg.push(matkl); 
  msg.push(matyp); 
  msg.push(meins);  
//   matkx = matkx.trim();

  if (!matkx) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);
  console.log(msg);

});

// Output message to DOM
function outputMessage(message) {
        if (message.length !=0) {
        document.getElementById('matkx').value = message.text[0];
        document.getElementById('mbrsh').value = message.text[1];
        document.getElementById('matkl').value = message.text[2];
        document.getElementById('matyp').value = message.text[3];
        document.getElementById('meins').value = message.text[4];
        } 
}
// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users in room to DOM
function outputUsers(users) {
      userList.innerHTML = '';
      users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
      });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
      if (leaveRoom) {
        window.location = '../index.html';
      } 
});

