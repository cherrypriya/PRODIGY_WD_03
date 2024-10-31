let currentPlayer = "X";
let gameActive = true;
let gameMode = '';
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const board = document.getElementById("board");
const statusDisplay = document.getElementById("status");
const winnerStatus = document.getElementById("winnerStatus");
const restartButton = document.getElementById("restart");

function startGame(mode) {
    gameMode = mode;
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("gamePage").style.display = "block";
    createBoard();
    updateStatus();
}

function createBoard() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    board.innerHTML = "";
    gameActive = true;
    currentPlayer = "X";
    
    gameState.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.setAttribute("data-cell-index", index);
        cellElement.innerText = cell;
        cellElement.addEventListener("click", handleCellClick);
        board.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = clickedCell.getAttribute("data-cell-index");

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();

    if (gameActive && gameMode === 'playerVsComputer') {
        currentPlayer = "O";
        setTimeout(computerMove, 500); // Delay for computer's move
    }
}

function updateCell(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
}

function updateStatus() {
    statusDisplay.innerText = `It's ${currentPlayer}'s turn!`;
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        displayWinner(currentPlayer);
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.innerText = "It's a draw!";
        displayWinner("draw");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

function displayWinner(winner) {
    gameActive = false;
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("winnerPage").style.display = "block";
    
    if (winner === "X") {
        winnerStatus.innerHTML = `Player X wins! 🎉`;
    } else if (winner === "O") {
        winnerStatus.innerHTML = `Player O wins! 🎉`;
    } else {
        winnerStatus.innerHTML = `It's a draw! 🤝`;
    }
}

function computerMove() {
    let availableCells = gameState.map((cell, index) => cell === "" ? index : null).filter(cell => cell !== null);
    const randomCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    const clickedCell = document.querySelector(`[data-cell-index='${randomCellIndex}']`);

    if (clickedCell) {
        updateCell(clickedCell, randomCellIndex);
        checkResult();
    }
}

function exitGame() {
    document.getElementById("mainPage").style.display = "block";
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("winnerPage").style.display = "none";
}

function restartGame() {
    document.getElementById("winnerPage").style.display = "none";
    startGame(gameMode);
}

restartButton.addEventListener("click", createBoard);
