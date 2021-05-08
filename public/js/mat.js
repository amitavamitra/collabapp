const chatForm = document.getElementById('mat-form');
const chatMessages = document.querySelector('.form-control');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
var timeout=undefined;
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
var keyCode = "";
// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

//   // Scroll down - Since its a field there is no need for scroll.
//   chatMessages.scrollTop = chatMessages.scrollHeight;
});

//  KeyDown Event start

chatForm.addEventListener('keydown', (e) => {
  if (e.isComposing) {
  typing=true
  socket.emit('typing', {user:username, typing:true , keypressed:e.keyCode })
  clearTimeout(timeout)
  timeout=setTimeout(typingTimeout, 1500)
}
else{
  clearTimeout(timeout)
  typingTimeout()
  // sendMessage()
}

function typingTimeout(){
  typing=false
  socket.emit('typing', {user:username, typing:false ,keypressed:e.keyCode})
  console.log(keyCode)
}

    // function sendMessage(){
    //   // var userName = user 
    //   var message = $('#unit').val()
    //   var unit = `{"${username}" : "${message}"}`
    //   $.post('/send_message', JSON.parse(unit), ()=>{
    //   console.log('unit posted succesfully')
    //   })
    //   $('#unit').val("")
 
    // }
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

// Add users to DOM
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
