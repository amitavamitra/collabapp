const chatForm = document.getElementById('mat-form');
const chatMessages = document.querySelector('.form-control');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

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

//   // Clear input - Not valid as we update the very id.
//   e.target.elements.matkx.value = '';
//   e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
//   const div = document.createElement('div');
//   div.classList.add('message');
//   const p = document.createElement('p');
//   p.classList.add('meta');
//   p.innerText = message.username;
//   p.innerHTML += `<span>${message.time}</span>`;
//   div.appendChild(p);
//   const para = document.createElement('p');
//   para.classList.add('text');
//   para.innerText = message.text;
//   div.appendChild(para);
//   document.querySelector('.form-control').appendChild(div);
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
  } else {
  }
});