const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Handle socket connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle dice roll event
    socket.on('rollDice', (diceNum) => {  // rolldice is the event and diceRolled is the event listener
        io.emit('diceRolled', diceNum);
    });

    // Handle score hold event
    socket.on('holdScore', (data) => {
        io.emit('scoreHeld', data);
    });

    // Handle new game event
    socket.on('resetGame', () => {
        io.emit('gameReset');
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
