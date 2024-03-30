const board = document.getElementById("bingo-container");
const box = document.getElementById("call-number");
const title = document.getElementById("board-title");
const nameBox = document.getElementById("player-name");
const showName = document.getElementById("playerName");
const winnerName = document.getElementById('playerNameInput').value; 

function createCell(item, clickable, winnerName){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = item;
    
    if(clickable === true){
        cell.addEventListener("click", () => toggleCell(cell, winnerName));
        cell.style.cursor = "pointer";
    }
    
    return cell;
}

function addPlayerName(winnerName) {
    const showName = document.getElementById('player-name'); 
    const nameInput = document.getElementById('enter/show-name'); 

    nameInput.remove(); 

    const addedName = document.createElement("div");
    addedName.textContent = "Welcome " + winnerName; 
    
    showName.appendChild(addedName); 
}

function checkColumns() {
    const columns = document.querySelectorAll('.bingo-column');
    let colCount = 0;

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const cells = column.querySelectorAll('.cell');
        let count = 0;

        for (let j = 0; j < cells.length; j++) {
            if (cells[j].classList.contains('clicked')) {
                count++;
            }
        }

        if (count === 5) {
            return true; 
        }
    }

    return false; 
}

function checkRows(){
    const columns = document.querySelectorAll('.bingo-column');
    let row1 = 0;
    let row2 = 0;
    let row3 = 0;
    let row4 = 0;
    let row5 = 0;

    for (let i = 0; i < columns.length; i++){
        const column = columns[i];
        const cells = column.querySelectorAll('.cell'); 

        for (let j = 0; j < cells.length; j++) {
            if (cells[j].classList.contains('clicked') && j === 0){
                row1++;
            }
            else if (cells[j].classList.contains('clicked') && j === 1){
                row2++;
            }
            else if (cells[j].classList.contains('clicked') && j === 2){
                row3++;
            }
            else if (cells[j].classList.contains('clicked') && j === 3){
                row4++;
            }
            else if (cells[j].classList.contains('clicked') && j === 4){
                row5++;
            }
        }

        if (row1 === 5 || row2 === 5 || row3 === 5 || row4 === 5 || row5 === 5){
            return true
        }
    }

    return false;
}

function checkDiagonals(){
    const columns = document.querySelectorAll('.bingo-column');
    let diag1 = 0;
    let diag2 = 0;

    for (let i = 0; i < columns.length; i++){
        const column = columns[i];
        const cells = column.querySelectorAll('.cell'); 

        if (i == 0 && (cells[0].classList.contains('clicked'))){
            diag1++;
        }
        else if (i == 0 && (cells[4].classList.contains('clicked'))){
            diag2++;
        }
        else if (i == 1 && (cells[1].classList.contains('clicked'))){
            diag1++;
        }
        else if (i == 1 && (cells[3].classList.contains('clicked'))){
            diag2++;
        }
        else if (i == 2 && (cells[2].classList.contains('clicked'))){
            diag1++;
            diag2++;
        }
        else if (i == 3 && (cells[3].classList.contains('clicked'))){
            diag1++;
        }
        else if (i == 3 && (cells[1].classList.contains('clicked'))){
            diag2++;
        }
        else if (i == 4 && (cells[4].classList.contains('clicked'))){
            diag1++;
        }
        else if (i == 4 && (cells[0].classList.contains('clicked'))){
            diag2++;
        }

        if (diag1 === 5 || diag2 == 5){
            return true;
        }
    }

    return false;
}


function gameWon(){
    if (checkColumns()){
        return true;
    }

    else if (checkRows()){
        return true;
    }

    else if (checkDiagonals()){
        return true;
    }

    else {
        return false;
    }
}

function checkClickedCell(clickedCell) {
    let isClicked = false;
    
    const calledColumns = document.querySelectorAll('.called-number-column');
    calledColumns.forEach((column) => {
        const cells = column.querySelectorAll('.cell');
        cells.forEach((cell) => {
            if (clickedCell.textContent === cell.textContent && cell.classList.contains('clicked')) {
                isClicked = true;
            }
        });
    });

    return isClicked;
}

function toggleCell(cell, winnerName) {
    const called = checkClickedCell(cell);
    
    if(cell.textContent === "FREE"){
        cell.classList.toggle("clicked");
        gameWon();
        if(gameWon()){
            socket.emit('announce winner', ({winnerName}));
            socket.emit('promptNewGame');
        }
        return;
    }
    else if (called === true) {
        cell.classList.toggle("clicked");
        gameWon();
        if(gameWon()){
            socket.emit('announce winner', ({winnerName}));
            console.log(winnerName);
            socket.emit('promptNewGame');
            
        }
        return;
    }
    else if (called === false){
        const message = document.createElement("div");
        message.style.fontFamily = "Arial, bold";
        message.style.fontSize = "25px";
        message.textContent = "This number wasn't called yet, no cheating!";
        title.appendChild(message);
        setTimeout(() => {
            title.removeChild(message);
        }, 5000);
    }
}

function generateBoardNum(num, arr) {
    switch (num) {
        case 1:
            const num1 = Math.floor(Math.random() * (16 - 1)) + 1;
            if (arr == null){
                arr.push(num1);
                return num1;
            }
            else if (arr.includes(num1)){
                return generateBoardNum(num, arr);
            }
            else {
                arr.push(num1);
                return num1;
            }
          break;
        case 2:
            const num2 = Math.floor(Math.random() * (31 - 16)) + 16;
            if (arr == null){
                arr.push(num2);
                return num2;
            }
            else if (arr.includes(num2)){
                return generateBoardNum(num, arr);
            }
            else {
                arr.push(num2);
                return num2;
            }
          break;
        case 3:
            const num3 = Math.floor(Math.random() * (46 - 31)) + 31;
            if (arr == null){
                arr.push(num3);
                return num3;
            }
            else if (arr.includes(num3)){
                return generateBoardNum(num, arr);
            }
            else {
                arr.push(num3);
                return num3;
            }
            break;
        case 4:
            const num4 = Math.floor(Math.random() * (61 - 46)) + 46;
            if (arr == null){
                arr.push(num4);
                return num4;
            }
            else if (arr.includes(num4)){
                return generateBoardNum(num, arr);
            }
            else {
                arr.push(num4);
                return num4;
            }
            break;
        case 5:
            const num5 = Math.floor(Math.random() * (76 - 61)) + 61;
            if (arr == null){
                arr.push(num5);
                return num5;
            }
            else if (arr.includes(num5)){
                return generateBoardNum(num, arr);
            }
            else {
                arr.push(num5);
                return num5;
            }
            break;
      }
}

function createBoard(winnerName){
    const board = document.getElementById("bingo-container");

    for (let col = 1; col <= 5; col++) {
        const column = document.createElement("div");
        column.classList.add("bingo-column");
        column.setAttribute("id", "bingoColumn")

        let letter;
            switch (col) {
              case 1:
                letter = 'B';
                break;
              case 2:
                letter = 'I';
                break;
              case 3:
                letter = 'N';
                break;
              case 4:
                letter = 'G';
                break;
              case 5:
                letter = 'O';
                break;
            }

        const letterText = document.createElement("span");
        letterText.textContent = letter;
        letterText.style.fontFamily = "Comic Sans MS, cursive";
        letterText.style.fontSize = "50px";
        const letterContainer = document.createElement("div");
        letterContainer.style.textAlign = "center";
        letterContainer.appendChild(letterText);
        column.appendChild(letterContainer);

        let uniqueNums = [];
        
        for (let row = 1; row <= 5; row++) {
            if(col == 3 && row == 3){
                const cell = createCell("FREE", true, winnerName)
                column.appendChild(cell);
            }
            else{
                const cell = createCell(generateBoardNum(col, uniqueNums), true, winnerName);
                column.appendChild(cell);
            }
        }
    
        board.appendChild(column);
    }
}

function createCalledNumbersBoard(){
    const calledNumbers = document.getElementById("previous-numbers");
    
    for (let col = 1; col <= 5; col++){
        const column = document.createElement("div");
        column.classList.add("called-number-column");
    
        let letter;
            switch (col) {
              case 1:
                letter = 'B';
                break;
              case 2:
                letter = 'I';
                break;
              case 3:
                letter = 'N';
                break;
              case 4:
                letter = 'G';
                break;
              case 5:
                letter = 'O';
                break;
            }
        
        const letterText = document.createTextNode(letter);
        const letterContainer = document.createElement("div");
        letterContainer.style.pointerEvents = "none";
        letterContainer.style.cursor = "none !important";
        letterContainer.style.textAlign = "center";
        letterContainer.appendChild(letterText);
        column.appendChild(letterContainer);
   
        switch(letter){
            case 'B':
                for (let row = 1; row <= 15; row++){
                    const cell = createCell(row, false);
                    column.appendChild(cell);
                }
                break;
            case 'I':
                for (let row = 16; row <= 30; row++){
                    const cell = createCell(row, false);
                    column.appendChild(cell);
                }
                break;
            case 'N':
                for (let row = 31; row <= 45; row++){
                    const cell = createCell(row, false);
                    column.appendChild(cell);
                }
                break
            case 'G':
                for (let row = 46; row <= 60; row++){
                    const cell = createCell(row, false);
                    column.appendChild(cell);
                }
                break;
            case 'O':
                for (let row = 61; row <= 75; row++){
                    const cell = createCell(row, false);
                    column.appendChild(cell);
                }
                break;
        
        }

        calledNumbers.appendChild(column);
    }
}
createCalledNumbersBoard();

function addNumberToCalledBoard(bingoNum) {
    const calledColumns = document.querySelectorAll('.called-number-column');

    if (calledColumns.length === 0) {
        console.warn("No columns with class 'called-number-column' found");
        return;
    }

    calledColumns.forEach((column) => {
        const cells = column.querySelectorAll('.cell');

        cells.forEach((cell) => {
            if (bingoNum === cell.textContent) {
                console.log(`Matching cell found: ${bingoNum}`);
                cell.classList.toggle("clicked");
            }
        });
    });
}

function clearCalledBoard(bingoNum) {
    const calledColumns = document.querySelectorAll('.called-number-column');

    if (calledColumns.length === 0) {
        console.warn("No columns with class 'called-number-column' found");
        return;
    }

    calledColumns.forEach((column) => {
        const cells = column.querySelectorAll('.cell');

        cells.forEach((cell) => {
            cell.classList.remove("clicked");
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const playerNameForm = document.getElementById('playerName'); 
    playerNameForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let winnerName = document.getElementById('playerNameInput').value; 
        console.log(winnerName);
        addPlayerName(winnerName);
        createBoard(winnerName);
    });

    const button = document.getElementById('generate-number');
    button.addEventListener('click', function () {
        socket.emit('generateNumber');
    });

    socket.on('updateCalledBoard', ({ bingoNum, number }) => {
        if(number === undefined){
            alert("All numbers have been called! No one has won yet?!?!");
        }

        const button = document.getElementById('generate-number');
        button.disabled = true;
        setTimeout(() => {
            button.disabled = false;
        }, 1000);
        const countdownDuration = 1;

        const message = document.createElement("div");
        message.style.fontFamily = "Arial, bold";
        message.style.fontSize = "25px";

        function updateCountdownMessage(secondsLeft) {
            message.textContent = "New number can be called in " + secondsLeft + " seconds...";
        }
                
        const appendBox = document.getElementById('appendBox'); 
        appendBox.appendChild(message);
        
        updateCountdownMessage(countdownDuration);

        let secondsLeft = countdownDuration;
        const countdownInterval = setInterval(() => {
            secondsLeft--;
            updateCountdownMessage(secondsLeft);
            if (secondsLeft === 0) {
                clearInterval(countdownInterval);
                appendBox.removeChild(message);
                button.disabled = false;
            }
        }, 1000);
        
        addNumberToCalledBoard(number.toString());

        var elementToRemove = document.getElementById("newNum");
        if (elementToRemove) {
            elementToRemove.remove();
        }

        const newNumElement = document.createElement("div");
        newNumElement.id = "newNum";
        newNumElement.style.textAlign = "center";
        newNumElement.style.fontSize = "50px";
        newNumElement.textContent = bingoNum;
        box.appendChild(newNumElement);
    });

    socket.on('announce the winner', ({winnerName}) => {
        alert(winnerName + " has won the game! Would you like to start a new game?");
    });

    socket.on('generateNewGameButton', () => {
        const newGameButton = document.createElement('button');
        newGameButton.id = "newGame";
        newGameButton.style.height = '50px'; 
        newGameButton.style.width = '125px'; 
        newGameButton.textContent = 'New Game';
        newGameButton.style.display = 'block'; 
        newGameButton.style.margin = '0 auto'; 
        
        newGameButton.addEventListener('click', () => {
            socket.emit('resetGameBoard', ({winnerName}));
        });
        
        title.appendChild(newGameButton);
    });

    socket.on('newGameBoard', () => {
        for (i = 1; i <= 5; i++) {
            const removeColumn = this.getElementById("bingoColumn");
            board.removeChild(removeColumn);
        }
        console.log(winnerName);
        
        createBoard(winnerName);
        clearCalledBoard();
        var elementToRemove = document.getElementById("newNum");
            elementToRemove.remove();
        var elementToRemove = document.getElementById("newGame");
        if (elementToRemove) {
            elementToRemove.remove();
        }

        alert("New game has been started!");
    });

    server.listen(3000, () => {
        console.log("server running at http://localhost:3000");
    });

});