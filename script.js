const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('statusMessage');
const restartButton = document.getElementById('restartButton');
const menuContainer = document.getElementById('menuContainer');
const gameContainer = document.getElementById('gameContainer');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const aiButton = document.getElementById('aiButton');
let currentPlayer = 'X';
let gameActive = true;
let againstAI = false;
const gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.textContent = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusMessage.textContent = `It's ${currentPlayer}'s turn`;

    if (currentPlayer === 'O' && againstAI && gameActive) {
        setTimeout(() => {
            handleAIMove();
        }, 500);
    }
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusMessage.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusMessage.textContent = `Game ended in a draw!`;
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState.fill("");
    statusMessage.textContent = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x');
        cell.classList.remove('o');
    });
}

function handleAIMove() {
    const bestMove = getBestMove();
    if (bestMove !== null) {
        handleCellPlayed(cells[bestMove], bestMove);
        handleResultValidation();
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = "O";
            let score = minimax(gameState, 0, false);
            gameState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    let scores = {
        'O': 1,
        'X': -1,
        'draw': 0
    };

    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            return a;
        }
    }

    if (!gameState.includes("")) {
        return 'draw';
    }

    return null;
}

function startTwoPlayerGame() {
    againstAI = false;
    menuContainer.style.display = 'none';
    gameContainer.style.display = 'block';
}

function startAIGame() {
    againstAI = true;
    menuContainer.style.display = 'none';
    gameContainer.style.display = 'block';
}

twoPlayerButton.addEventListener('click', startTwoPlayerGame);
aiButton.addEventListener('click', startAIGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);

statusMessage.textContent = `It's ${currentPlayer}'s turn`;
