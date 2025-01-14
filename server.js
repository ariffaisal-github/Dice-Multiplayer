const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static('public'));

let players = [];
let currentActivePlayerIndex = 0;

function switchActivePlayer() {
    currentActivePlayerIndex = currentActivePlayerIndex === 0 ? 1 : 0;
    const activePlayer = players[currentActivePlayerIndex];
    io.emit('updateActivePlayer', activePlayer.id);
}
// Handle socket connection 
io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id);

    let playerName = ""
    socket.on('playerJoined', (data) => {
        // console.log(`👋 Player joined: ${data.name} with ID: ${socket.id}`);
        playerName = data.name;
        if (players.length < 2) {
            const playerRole = players.length === 0 ? "Player 1" : "Player 2";
            players.push({ id: socket.id, name: data.name, role: playerRole });
            socket.emit('assignRole', { role: playerRole });
            io.emit('updatePlayers', players);
            console.log(`✅ ${data.name} joined as ${playerRole} ---> ID: ${socket.id}`);

            if (players.length === 2) {
                io.emit('updateActivePlayer', players[currentActivePlayerIndex].id);
            }
        } else {
            socket.emit('gameFull');
        }
    });

    // Handle dice roll event
    socket.on('rollDice', (diceNum) => {  // rolldice is the event and diceRolled is the event listener
        io.emit('diceRolled', diceNum);
        // switch player if dice rolls to 1
        if (diceNum === 1) {
            switchActivePlayer();
        }
    });

    // Handle score hold event
    socket.on('holdScore', (data) => {
        io.emit('scoreHeld', data);
        switchActivePlayer();
    });

    // Handle new game event
    socket.on('resetGame', () => {
        io.emit('gameReset');
        currentActivePlayerIndex = 0;
        io.emit('updateActivePlayer', players[currentActivePlayerIndex].id);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        // retrieve the disconnected player's name
        playerName = players.find(player => player.id === socket.id)?.name;
        // remove the disconnected player from the players array
        players = players.filter(player => player.id !== socket.id);
        // console.log('User disconnected:', socket.id);
        io.emit('updatePlayers', players);
        console.log(`😢 Player ${playerName} with ID: ${socket.id} disconnected`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
