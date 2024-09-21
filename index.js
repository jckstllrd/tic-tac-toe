const gameController = (function () {
  let gameOver = false;

  const initiatePlayer = () => {
    const playerName = prompt("Player Name:");
    const playerMarker = prompt("Player Marker:");
    const player = createPlayer(playerName, playerMarker);
    return player;
  };

  const playGame = () => {
    const player1 = initiatePlayer();
    gameboard.displayBoard();
    while (!gameOver) {
      console.log(player1.getTurn());

      console.log("here 1");
      if (player1.getTurn()) {
        console.log("here 2");
        let playerSelectionRow = prompt("Pick a row 1-3:");
        let playerSelectionCol = prompt("Pick a column 1-3:");
        gameboard.updateBoard(
          player1.getMarker(),
          playerSelectionRow,
          playerSelectionCol
        );
        player1.updateTurn(false);
      }
      gameOver = true;
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
    console.log(board);
  };

  return { updateBoard, displayBoard };
})();

function createPlayer(name, marker) {
  const score = 0;
  const isTurn = true;
  const getMarker = () => marker;
  const getScore = () => score;
  const getTurn = () => isTurn;
  const updateTurn = (turn) => (isTurn = turn);
  const increaseScore = () => score++;

  return { name, getMarker, getScore, increaseScore, getTurn, updateTurn };
}

gameController.playGame();
