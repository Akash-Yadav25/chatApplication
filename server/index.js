const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const {addUser , removeUser , getUser , getUsersInRoom } = require('./users.js');

var cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const router = require('./router');

app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const io = require("socket.io")(server,{
    cors: {
      origin: "*",
      methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
      allowedHeaders:["secretHeader"],
      credentials: true
    }
    })

io.on('connection',(socket)=>{

    socket.on('join',({name , room},callback)=>{
        const {error , user} = addUser({id: socket.id , name , room});

        if(error) return callback(error);

        socket.emit('message' , {user: 'admin' , text: `${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message' , {user: 'admin' , text: `${user.name}, has joined!`});

        socket.join(user.room);
        
        io.to(user.room).emit('roomData',{room: user.room , users: getUsersInRoom(user.room) , usersname : user.name})

        callback();
    });

    socket.on('sendMessage' , (message , callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message' , {user: user.name , text: message});
        io.to(user.room).emit('roomData' , {room: user.room , users: getUsersInRoom(user.room)});

        callback();
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',{user: 'admin' , text : `${user.name} has left.`})
        }
    })
})

app.use(router);

server.listen(PORT , ()=> console.log(`Server has start on ${PORT}`));