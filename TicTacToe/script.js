/* ================= GAMEBOARD ================= */

function createGameboard() {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const getBoard = () => board;

  const resetBoard = () => {
    board.forEach(row => row.fill(""));
  };

  const placeSymbol = (symbol, x, y) => {
    if (board[x][y] === "") {
      board[x][y] = symbol;
      return true;
    }
    return false;
  };

  return { getBoard, resetBoard, placeSymbol };
}

/* ================= PLAYER ================= */

function createPlayer(name, symbol) {
  let wins = 0;

  const getName = () => name;
  const getSymbol = () => symbol;
  const addWin = () => wins++;
  const getWins = () => wins;

  return { getName, getSymbol, addWin, getWins };
}

/* ================= GAME CONTROLLER ================= */

function GameController() {
  const gameboard = createGameboard();
  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");

  let currentPlayer = Math.random() < 0.5 ? player1 : player2;
  let moveCount = 0;
  let gameOver = false;

  const getBoard = () => gameboard.getBoard();
  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const resetGame = () => {
    gameboard.resetBoard();
    moveCount = 0;
    gameOver = false;
    currentPlayer = Math.random() < 0.5 ? player1 : player2;
  };

  const playRound = (x, y) => {
    if (gameOver) return { status: "game over" };

    const success = gameboard.placeSymbol(
      currentPlayer.getSymbol(),
      x,
      y
    );

    if (!success) return { status: "invalid" };

    moveCount++;

    if (checkWinner(gameboard.getBoard())) {
      gameOver = true;
      currentPlayer.addWin();
      return { status: "win", winner: currentPlayer };
    }

    if (moveCount === 9) {
      gameOver = true;
      return { status: "draw" };
    }

    switchTurn();
    return { status: "continue" };
  };

  return {
    playRound,
    resetGame,
    getBoard,
    getCurrentPlayer
  };
}

/* ================= WIN CHECK ================= */

function checkWinner(board) {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) return true;

    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) return true;
  }

  if (
    board[1][1] &&
    (
      (board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
      (board[0][2] === board[1][1] && board[1][1] === board[2][0])
    )
  ) return true;

  return false;
}

/* ================= DISPLAY CONTROLLER ================= */

function DisplayController() {
  const game = GameController();
  const cells = document.querySelectorAll(".cell");
  const statusText = document.getElementById("status");
  const resetBtn = document.getElementById("reset");

  const renderBoard = () => {
    const board = game.getBoard();
    cells.forEach(cell => {
      const row = cell.dataset.row;
      const col = cell.dataset.col;
      cell.textContent = board[row][col];
    });
  };

  const enableBoard = () => {
    cells.forEach(cell => cell.disabled = false);
  };

  const disableBoard = () => {
    cells.forEach(cell => cell.disabled = true);
  };

  const updateStatus = (result) => {
    if (result.status === "win") {
      statusText.textContent =
        `${result.winner.getName()} wins!`;
      disableBoard();
    } else if (result.status === "draw") {
      statusText.textContent = "It's a draw!";
      disableBoard();
    } else {
      statusText.textContent =
        `${game.getCurrentPlayer().getName()}'s turn`;
    }
  };

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      const result = game.playRound(row, col);
      renderBoard();
      updateStatus(result);
    });
  });

  resetBtn.addEventListener("click", () => {
    game.resetGame();
    enableBoard();
    renderBoard();
    statusText.textContent =
      `${game.getCurrentPlayer().getName()}'s turn`;
  });

  renderBoard();
  statusText.textContent =
    `${game.getCurrentPlayer().getName()}'s turn`;
}

DisplayController();
