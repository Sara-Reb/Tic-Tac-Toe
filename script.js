/* Gameboard */
const gameGrid = (function () {
  const rows = 3;
  const columns = 3;

  let grid = [];

  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < columns; j++) {
      grid[i].push(Cell());
    }
  }

  const getGrid = () => {
    return grid;
  };

  const addMarker = (player, row, column) => {
    /* if cell is occupied then stop */

    if (grid[row][column].getValue() != "") {
      return "invalid";
    }

    /* Change cell value */
    grid[row][column].setValue(player);
  };

  const printGrid = () => {
    const gridValues = grid.map((row) => row.map((cell) => cell.getValue()));
    console.log(gridValues);
  };

  const resetGrid = () => {
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < columns; j++) {
        grid[i].push(Cell());
      }
    }
  };

  return { getGrid, addMarker, printGrid, resetGrid };
})();

/* Cell */
function Cell() {
  let value = "";

  const getValue = () => {
    return value;
  };

  const setValue = (player) => {
    value = player;
  };

  return { getValue, setValue };
}

/* Players */
function Player(name, marker) {
  this.name = name;
  this.marker = marker;
  const getName = () => {
    return name;
  };
  const getMarker = () => {
    return marker;
  };
  return { getName, getMarker };
}

const uiGrid = document.querySelector(".game-grid");
const circleIcon = "./img/circle.png";
const crossIcon = "./img/cross.png";
const communicationDiv = document.querySelector(".communication");
const resetButton = document.querySelector(".reset");

const displayGame = (function () {
  const renderGame = () => {
    uiGrid.innerHTML = "";
    const grid = gameGrid.getGrid();
    for (row of grid) {
      for (cell of row) {
        const uiCell = document.createElement("div");
        uiCell.className = "cell";
        uiCell.dataset.row = `${grid.indexOf(row)}`;
        uiCell.dataset.col = `${row.indexOf(cell)}`;

        const img = document.createElement("img");
        if (cell.getValue() === "X") {
          img.src = crossIcon;
          uiCell.appendChild(img);
        } else if (cell.getValue() === "O") {
          img.src = circleIcon;
          uiCell.appendChild(img);
        }
        uiCell.addEventListener("click", (e) => {
          const row = e.currentTarget.dataset.row;
          const col = e.currentTarget.dataset.col;
          console.log({ row, col });
          game.playRound(row, col);
        });
        uiGrid.appendChild(uiCell);
      }
    }
  };

  const renderCommunication = function (text, status = "play") {
    communicationDiv.innerHTML = "";
    const message = document.createElement("p");
    message.innerText = text;
    if (status != "play") {
      message.classList.add("final");
    }
    communicationDiv.appendChild(message);
  };

  return { renderGame, renderCommunication };
})();

displayGame.renderGame();

/* Game flow */
const game = (function () {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  const players = [player1, player2];

  let status = "play";

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const checkGameStatus = () => {
    const grid = gameGrid.getGrid();
    let row = grid.length;
    let column = grid[0].length;

    for (let i = 0; i < row; i++) {
      /* Check for row win */
      let currentRow = grid[i];
      if (
        currentRow.every(
          (cell) =>
            cell.getValue() != "" &&
            cell.getValue() === currentRow[0].getValue()
        )
      ) {
        status = "win";
        break;
      }

      /* CHeck for column win */
      let currentColumn = grid.map((row) => row[i]);
      if (
        currentColumn.every(
          (cell) =>
            cell.getValue() != "" &&
            cell.getValue() === currentColumn[0].getValue()
        )
      ) {
        status = "win";
        break;
      }
    }

    /* Check diagonal win */
    let diagonal1 = grid.map((row, i) => row[i]);
    let diagonal2 = grid.map((row, i) => row[row.length - i - 1]);

    if (
      diagonal1.every(
        (cell) =>
          cell.getValue() != "" && cell.getValue() === diagonal1[0].getValue()
      ) ||
      diagonal2.every(
        (cell) =>
          cell.getValue() != "" && cell.getValue() === diagonal2[0].getValue()
      )
    ) {
      status = "win";
    }

    /* Check for tie */
    if (grid.every((row) => row.every((cell) => cell.getValue() != ""))) {
      status = status === "win" ? "win" : "tie";
    }
  };

  const resetGame = () => {
    status = "play";
    activePlayer = players[0];
    /* Initial message */
    const text = `${getActivePlayer().getName()}'s turn`;
    displayGame.renderCommunication(text);
  };

  const getStatus = () => {
    return status;
  };

  const playRound = (row, column) => {
    if (getStatus() != "play") {
      console.log(getStatus());
      return;
    }
    const round = gameGrid.addMarker(
      getActivePlayer().getMarker(),
      row,
      column
    );
    if (round === "invalid") {
      gameGrid.printGrid();
      const text = `${getActivePlayer().getName()}'s turn.`;
      displayGame.renderCommunication(text);

      return;
    }
    displayGame.renderGame();

    checkGameStatus();
    const status = getStatus();
    console.log(status);
    if (status === "win") {
      const text = `${getActivePlayer().getName()} wins!`;
      displayGame.renderCommunication(text, status);
    } else if (status === "tie") {
      console.log(status);

      const text = `Tie!`;
      displayGame.renderCommunication(text, status);
    } else {
      switchPlayer();
      const text = `${getActivePlayer().getName()}'s turn.`;
      displayGame.renderCommunication(text, status);
    }
  };

  /* Initial message */
  const text = `${getActivePlayer().getName()}'s turn`;
  displayGame.renderCommunication(text);

  return { getActivePlayer, playRound, resetGame };
})();

resetButton.addEventListener("click", () => {
  gameGrid.resetGrid();
  game.resetGame();
  displayGame.renderGame();
});
