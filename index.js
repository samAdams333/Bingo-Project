import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'board.html'));
});

let gameNums = [];

for(let i = 1; i < 76; i++){
    gameNums.push(i);
}

function generateGameNum(arr) {
    const number = arr[Math.floor(Math.random() * (arr.length - 0)) + 0];
    let index = arr.indexOf(number);
    arr.splice(index, 1);

    let letter;
    if (number > 0 && number < 16) {
        letter = 'B';
    } 
    else if (number > 15 && number < 31) {
        letter = 'I';
    } 
    else if (number > 30 && number < 46) {
        letter = 'N';
    } 
    else if (number > 45 && number < 61) {
        letter = 'G';
    } 
    else if (number > 60 && number < 76) {
        letter = 'O';
    } 
    else {
        letter = 'B'; 
    }

    let bingoNum = letter + " " + number;

    return {number, bingoNum };
}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('generateNumber', () => {
        const {number, bingoNum } = generateGameNum(gameNums);
        console.log('Generated Number: ' + bingoNum);
        io.emit('updateCalledBoard', {number, bingoNum });
    });

    socket.on('announce winner', ({winnerName}) => {
        console.log("winnerName");
        io.emit('announce the winner', {winnerName});
    });

    socket.on('promptNewGame', () => {
        gameNums = [];

        for(let i = 1; i < 76; i++){
            gameNums.push(i);
    }
        io.emit('generateNewGameButton');
    });

    socket.on('resetGameBoard', () => {
        io.emit('newGameBoard');
    });
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});