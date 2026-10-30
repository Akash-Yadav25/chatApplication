const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');
const router = require('./router');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(router);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["secretHeader"],
    credentials: true
  },
  maxHttpBufferSize: 5e6 // 5MB buffer for ephemeral image data transfers
});

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      if (typeof callback === 'function') return callback(error);
      return;
    }

    socket.join(user.room);

    // Welcome message to user who joined (in-memory only)
    socket.emit('message', {
      id: `${Date.now()}-welcome`,
      user: 'admin',
      text: `${user.name}, welcome to #${user.room}!`,
      type: 'admin',
      timestamp: new Date().toISOString()
    });

    // Broadcast announcement to everyone else in room
    socket.broadcast.to(user.room).emit('message', {
      id: `${Date.now()}-join-${user.name}`,
      user: 'admin',
      text: `${user.name} has joined!`,
      type: 'admin',
      timestamp: new Date().toISOString()
    });

    // Send updated room member list
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    if (typeof callback === 'function') callback();
  });

  socket.on('sendMessage', (messageData, callback) => {
    const user = getUser(socket.id);

    if (user) {
      let payload;
      if (typeof messageData === 'object' && messageData !== null) {
        payload = {
          ...messageData,
          id: messageData.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          user: user.name,
          timestamp: messageData.timestamp || new Date().toISOString()
        };
      } else {
        payload = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          user: user.name,
          text: messageData,
          type: 'text',
          timestamp: new Date().toISOString()
        };
      }

      // Ephemeral broadcast to room
      io.to(user.room).emit('message', payload);
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }

    if (typeof callback === 'function') callback();
  });

  // Ephemeral typing indicator relay
  socket.on('typing', ({ isTyping }) => {
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit('userTyping', {
        user: user.name,
        isTyping: Boolean(isTyping)
      });
    }
  });

  // Ephemeral message reaction relay
  socket.on('messageReaction', ({ messageId, emoji }) => {
    const user = getUser(socket.id);
    if (user && messageId && emoji) {
      io.to(user.room).emit('messageReaction', {
        messageId,
        emoji,
        user: user.name
      });
    }
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        id: `${Date.now()}-leave-${user.name}`,
        user: 'admin',
        text: `${user.name} has left.`,
        type: 'admin',
        timestamp: new Date().toISOString()
      });

      // Clear any typing state for leaving user
      socket.broadcast.to(user.room).emit('userTyping', {
        user: user.name,
        isTyping: false
      });

      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server has started on ${PORT}`));
