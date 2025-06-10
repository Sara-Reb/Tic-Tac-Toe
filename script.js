/* Gameboard */
const gameGrid = (function () {
  const rows = 3;
  const columns = 3;

  const grid = [];

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

  return { getGrid, addMarker, printGrid };
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

/* Game flow */
const game = (function () {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  const players = [player1, player2];

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const printNewRound = () => {
    gameGrid.printGrid();
    console.log(`${getActivePlayer().getName()}'s turn.`);
  };

  const checkGameStatus = () => {
    let status = "play";

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

      for (let j = 0; j < column; j++) {
        if ((i + j) % 2 != 0) {
          break;
        }
      }
    }

    /* Check diagonal win */
    let diagonal1 = grid.map((row, i) => row[i]);
    let diagonal2 = grid.map((row, i) => row[row.length - i - 1]);
    console.log(
      diagonal1.map((cell) => cell.getValue()),
      diagonal2.map((cell) => cell.getValue())
    );
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

    console.log(status);
    return status;
  };

  const playRound = (row, column) => {
    console.log(
      `${getActivePlayer().getName()} put ${getActivePlayer().getMarker()} on the grid`
    );
    const round = gameGrid.addMarker(
      getActivePlayer().getMarker(),
      row,
      column
    );
    if (round === "invalid") {
      console.log("The cell is occupied");
      gameGrid.printGrid();
      console.log(`${getActivePlayer().getName()}'s turn.`);

      return;
    }

    checkGameStatus();
    switchPlayer();
    printNewRound();
  };

  /* Initial message */
  console.log("Let's start!");
  printNewRound();

  return { getActivePlayer, playRound };
})();
