const gameController = (function () {
  let winState = false;
  let drawState = false;

  const initiatePlayer = () => {
    const playerName = prompt("Player Name:");
    const playerMarker = prompt("Player Marker:");
    const player = createPlayer(playerName, playerMarker);
    return player;
  };

  const initiateComputer = (playerMarker) => {
    let computerMarker = "";
    if (playerMarker == "X") {
      computerMarker = "O";
    } else {
      computerMarker = "X";
    }
    const compName = "Computer";
    const computer = createPlayer(compName, computerMarker);
    return computer;
  };

  const winOrDraw = () => {
    [winState, drawState] = gameboard.boardStateCheck();
    if (winState) {
      console.log("We have a winner");
    } else if (drawState) {
      console.log("We have a draw");
    }
  };

  const playGame = () => {
    const player1 = initiatePlayer();
    const computer = initiateComputer(player1.getMarker());
    computer.updateTurn(false);
    gameboard.displayBoard();
    while (!winState && !drawState) {
      console.log(player1.getTurn());

      console.log("here 1");
      if (player1.getTurn()) {
        console.log("Player turn");

        console.log("here 2");
        let playerSelectionRow = prompt("Pick a row 1-3:");
        let playerSelectionCol = prompt("Pick a column 1-3:");
        gameboard.updateBoard(
          player1.getMarker(),
          playerSelectionRow,
          playerSelectionCol
        );
        player1.updateTurn(false);
        computer.updateTurn(true);
        winOrDraw();
        if (winState || drawState) {
          break;
        }
      } else if (computer.getTurn()) {
        console.log("computer turn");

        let computerSelection = "";
        let selectRow;
        let selectCol;
        while (computerSelection != "_") {
          selectRow = Math.floor(Math.random() * 3 + 1);
          selectCol = Math.floor(Math.random() * 3 + 1);
          console.log(selectRow, selectCol);

          computerSelection = gameboard.checkCell(selectRow, selectCol);
        }
        gameboard.updateBoard(computer.getMarker(), selectRow, selectCol);
        computer.updateTurn(false);
        player1.updateTurn(true);
        winOrDraw();
      }
    }
  };
  return { playGame };
})();

const gameboard = (function () {
  const board = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ];

  const updateBoard = (marker, indexRow, indexCol) => {
    board[indexRow - 1][indexCol - 1] = marker;
    displayBoard();
  };
  const displayBoard = () => {
    board.forEach((row) => {
      console.log(row);
    });
  };

  const checkCell = (row, col) => {
    return board[row - 1][col - 1];
  };

  const boardStateCheck = () => {
    let isWinner = false;
    let isDraw = false;

    let filledCount = 0;

    //Rows
    for (let x = 0; x < board.length; x++) {
      let prevCell = "";
      let matches = 1;
      let row = board[x];
      for (let y = 0; y < board.length; y++) {
        let cell = row[y];
        console.log(cell + " vs. Previous: " + prevCell);

        if (cell == "_") {
          console.log("No winner on this row");
          prevCell = cell;
          break;
        }
        if (cell == prevCell) {
          console.log("Same cell");

          matches++;
        }
        prevCell = cell;
        filledCount++;
      }

      if (matches == 3) {
        isWinner = true;
        break;
      }
    }

    // Columns

    if (!isWinner || !isDraw) {
      for (let x = 0; x < board.length; x++) {
        let prevCell = "";
        let matches = 1;
        for (let y = 0; y < board.length; y++) {
          let cell = board[y][x];
          console.log(cell + " vs. Previous: " + prevCell);

          if (cell == "_") {
            console.log("No winner on this row");
            prevCell = cell;
            break;
          }
          if (cell == prevCell) {
            console.log("Same cell");

            matches++;
          }
          prevCell = cell;
        }

        if (matches == 3) {
          isWinner = true;
          break;
        }
      }
    }

    // First diagonal
    if (!isWinner && !isDraw) {
      let firstCell = board[0][0];
      let secondCell = board[1][1];
      let thirdCell = board[2][2];

      if (firstCell == secondCell && secondCell == thirdCell) {
        isWinner = true;
      }
    }

    // Second diagonal
    if (!isWinner && !isDraw) {
      let firstCell = board[0][2];
      let secondCell = board[1][1];
      let thirdCell = board[2][1];

      if (firstCell == secondCell && secondCell == thirdCell) {
        isWinner = true;
      }
    }

    if (filledCount == 9 && !isWinner) {
      isDraw = true;
    }
    console.log("Filled = " + filledCount);

    return [isWinner, isDraw];
  };

  return { updateBoard, displayBoard, boardStateCheck, checkCell };
})();

function createPlayer(name, marker) {
  const score = 0;
  let isTurn = true;
  const getMarker = () => marker;
  const getScore = () => score;
  const getTurn = () => isTurn;
  const updateTurn = (turn) => (isTurn = turn);
  const increaseScore = () => score++;

  return { name, getMarker, getScore, increaseScore, getTurn, updateTurn };
}

gameController.playGame();
