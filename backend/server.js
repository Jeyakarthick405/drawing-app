const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  io.emit('notification', `User ${socket.id} has joined`);

  socket.on('draw', (data) => {
    if (data.isDrawing) {
      socket.broadcast.emit('draw', data);
    } else {
      socket.broadcast.emit('draw', { isDrawing: false });
    }
  });
  
  socket.on('reset', () => {
    io.emit('reset');
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    io.emit('notification', `User ${socket.id} has left`);
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
