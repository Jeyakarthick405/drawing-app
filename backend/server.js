const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend origin for better security
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());

// Notify when a user connects or disconnects
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  io.emit('notification', `User ${socket.id} has joined`);

  // Handle drawing events
  socket.on('draw', (data) => {
    if (data.isDrawing) {
      socket.broadcast.emit('draw', data); // Broadcast drawing actions
    } else {
      socket.broadcast.emit('draw', { isDrawing: false }); // Notify others to stop drawing
    }
  });
  

  // Handle canvas reset
  socket.on('reset', () => {
    io.emit('reset'); // Notify all clients to reset the canvas
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    io.emit('notification', `User ${socket.id} has left`);
  });
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
