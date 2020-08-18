const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();



// custom imports
const router = require('./routes');
const {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
  getAllUsers,
} = require("./helpers/users");


// server configuration

const server = require('http').createServer(app);

const options = { /* ... */ };
const io = require('socket.io')(server, options);



require('dotenv').config();
app.use(morgan('common'));
app.use(express.json());
app.use(helmet());
app.use(cors({
    
}));

const PORT = process.env.PORT || 4000;

app.use(router);



io.on('connection', socket => {
    socket.on('join', ({name, room}, callback)=>{
        const {error, user} = addUser({id: socket.id, name, room});
        if(error){
            return callback(error);
        }
        socket.emit('message', {user: 'admin', text: `${user.name} welcome to the room`});
        socket.broadcast.to(user.room).emit('message',{user: 'admin', text: `${user.name} has joined`} );
        
        socket.join(user.room)
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        callback()
    });

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);
      console.log("user is ", getAllUsers());
      console.log('user id ', socket.id);
      io.to(user.room).emit("message", { user: user.name, text: message });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      callback();
    });
    io.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if (user) {
          io.to(user.room).emit("message", {
            user: "admin",
            text: `${user.name} has left.`,
          });
          io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
          });
        }
    })
});

server.listen(PORT, ()=> console.log(`server started successfully on port ${PORT}`));