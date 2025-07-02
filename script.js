// --- Game State ---
let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let mode = 'pvp'; // 'pvp' or 'ai'

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-btn');
const pvpBtn = document.getElementById('pvp-btn');
const aiBtn = document.getElementById('ai-btn');

// --- Winning Combinations ---
const winCombos = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
];

// --- Initialize Board ---
function renderBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, idx) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.dataset.index = idx;
        cellDiv.textContent = cell ? cell : '';
        cellDiv.addEventListener('click', handleCellClick);
        boardElement.appendChild(cellDiv);
    });
}

// --- Handle Cell Click ---
function handleCellClick(e) {
    const idx = +e.target.dataset.index;
    if (!gameActive || board[idx]) return;
    makeMove(idx, currentPlayer);
    if (mode === 'ai' && gameActive && currentPlayer === 'O') {
        setTimeout(aiMove, 400);
    }
}

// --- Make Move ---
function makeMove(idx, player) {
    if (!gameActive || board[idx]) return;
    board[idx] = player;
    renderBoard();
    const winCombo = getWinCombo(player);
    if (winCombo) {
        highlightWin(winCombo);
        statusElement.innerHTML = `<span class="win-icon">🏆</span> <strong>Player ${player} wins!</strong>`;
        gameActive = false;
    } else if (board.every(cell => cell)) {
        statusElement.innerHTML = "<strong>It's a draw!</strong>";
        gameActive = false;
    } else {
        currentPlayer = player === 'X' ? 'O' : 'X';
        statusElement.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// --- Get Winning Combo ---
function getWinCombo(player) {
    return winCombos.find(combo => combo.every(idx => board[idx] === player));
}

// --- Highlight Winning Cells ---
function highlightWin(combo) {
    const cells = document.querySelectorAll('.cell');
    combo.forEach(idx => {
        cells[idx].classList.add('win');
    });
}

// --- AI Move (Simple) ---
function aiMove() {
    // Simple AI: pick random empty cell
    const empty = board.map((cell, idx) => cell ? null : idx).filter(idx => idx !== null);
    if (empty.length === 0) return;
    const move = empty[Math.floor(Math.random() * empty.length)];
    makeMove(move, 'O');
}

// --- Reset Game ---
function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
    renderBoard();
}

// --- Mode Switching ---
pvpBtn.addEventListener('click', () => {
    mode = 'pvp';
    pvpBtn.classList.add('active');
    aiBtn.classList.remove('active');
    resetGame();
});
aiBtn.addEventListener('click', () => {
    mode = 'ai';
    aiBtn.classList.add('active');
    pvpBtn.classList.remove('active');
    resetGame();
});

resetBtn.addEventListener('click', resetGame);

// --- Initial Render ---
window.onload = () => {
    renderBoard();
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
}; 