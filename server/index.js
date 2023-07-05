const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

var cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const router = require('./router');

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["secretHeader"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    // Emit welcome message to the user who joined
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });

    // Broadcast a message to all users in the room (except the newly joined user)
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    // Emit room data to all users in the room
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      // Emit the message to all users in the room
      io.to(user.room).emit('message', { user: user.name, text: message });

      // Emit room data to all users in the room
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      // Emit a message to all users in the room when someone leaves
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });

      // Emit room data to all users in the room
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on ${PORT}`));