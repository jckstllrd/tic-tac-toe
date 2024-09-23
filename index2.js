const gameController = (function () {
  let isWin = false;
  let isDraw = false;
  let players = [];
  let currentPlayer;

  const getWin = () => {
    return isWin;
  };
  const getDraw = () => {
    return isDraw;
  };

  /* 
    Game Flow:
    - Page loads, grid is visible with a start button above the board.
    - When clicking the button, a dialog box opens asking the player's name
      and what marker they want, it then picks at random whose turn it is.
    - The page waits for one of the cells to be pick
    - When a cell is picked, the gameController calls a function that takes
      the marker and cell index and adds the marker to both the cell and the
      internal gameboard
    - A check is done against the internal gameboard to see if it ends the game
    - If not, then it's the other person's go
    - For computer's turn, random index picked that is available and this then 
      translates to a cell on the screen
    */

  const initialiseBoard = (player) => {
    const grid = document.querySelectorAll(".card");

    grid.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        takePlayerTurn(player, e.target.classList);
      });
    });
  };

  const initiateComputer = (playerMarker) => {
    let computerMarker = "";
    if (playerMarker == "X") {
      computerMarker = "O";
    } else {
      computerMarker = "X";
    }
    console.log(computerMarker);

    const compName = "Computer";
    const computer = createPlayer(compName, computerMarker);
    return computer;
  };

  const openMenu = () => {
    let playerName;
    let playerMarker;
    const dialog = document.querySelector("dialog");
    const closeBtn = document.querySelector(".close");

    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      dialog.close();
    });

    const submitBtn = document.querySelector("#submit");

    submitBtn.addEventListener("click", (event) => {
      event.preventDefault();
      playerName = document.querySelector('[name="player-name"]').value;
      playerMarker = document.querySelector(
        'input[name="player-marker"]:checked'
      ).value;
      console.log("clicked and added player " + playerName);

      const player = createPlayer(playerName, playerMarker);
      const computer = initiateComputer(player.getMarker());
      console.log(
        "Player marker is " + player.getMarker() + "vs. " + playerMarker
      );

      console.log("Created player with name " + player.name);

      players.push(player);
      players.push(computer);

      dialog.close();
      pickTurn();
      playGame();
    });

    dialog.showModal();
  };

  const pickTurn = () => {
    let playerIndex = Math.floor(Math.random() * 2);
    currentPlayer = players[playerIndex];
    console.log(currentPlayer.name);
  };

  const displayMarker = (marker, row, col) => {
    let cellClass = ".cell-" + row + "-" + col;
    const cell = document.querySelector(cellClass);
    const divMarker = document.createElement("div");

    divMarker.textContent = marker;
    divMarker.style.fontSize = 32;

    cell.appendChild(divMarker);
  };

  const takePlayerTurn = (player, cellClass) => {
    console.log(cellClass[1]);

    let indexRow = cellClass[1].split("-")[1];
    let indexCol = cellClass[1].split("-")[2];
    gameboard.updateBoard(player.getMarker(), indexRow, indexCol);
    displayMarker(player.getMarker(), indexRow, indexCol);
    gameboard.checkGameState();
    toggleTurn();
    playRound();
  };

  const takeTurn = (player) => {
    const divTurn = document.querySelector("div.turn");
    while (divTurn.firstChild) {
      divTurn.removeChild(divTurn.firstChild);
    }
    const currentTurnText = document.createElement("div");
    currentTurnText.textContent = "Current turn: " + player.name;
    divTurn.appendChild(currentTurnText);

    if (player.name == "Computer") {
      let compSelect = "";
      let selectRow;
      let selectCol;
      while (compSelect != "_") {
        selectRow = Math.floor(Math.random() * 3);
        selectCol = Math.floor(Math.random() * 3);

        compSelect = gameboard.checkCell(selectRow, selectCol);
      }
      console.log("marker comp is: " + player.getMarker());

      gameboard.updateBoard(player.getMarker(), selectRow, selectCol);
      displayMarker(player.getMarker(), selectRow, selectCol);
      gameboard.checkGameState();
      toggleTurn();
    } else {
      initialiseBoard(player);
    }
  };

  const toggleTurn = () => {
    if (currentPlayer == players[0]) {
      currentPlayer = players[1];
    } else {
      currentPlayer = players[0];
    }
  };

  const playRound = () => {
    if (!isWin && !isDraw) {
      takeTurn(currentPlayer);
    }
  };

  const playGame = () => {
    //Asks player for Name and marker in a dialog box
    // initialiseBoard();

    // Choose a player randomly to take turn first

    playRound();
  };

  return { openMenu, playGame, getWin, getDraw };
})();

const gameboard = (function () {
  const board = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ];

  const updateBoard = (marker, indexRow, indexCol) => {
    board[indexRow][indexCol] = marker;
    displayBoard();
  };
  const displayBoard = () => {
    board.forEach((row) => {
      console.log(row);
    });
  };

  const checkCell = (row, col) => {
    return board[row][col];
  };

  const checkGameState = () => {
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

  return { updateBoard, displayBoard, checkGameState, checkCell };
})();

function createPlayer(name, marker) {
  const score = 0;
  const getMarker = () => marker;
  const getScore = () => score;
  const increaseScore = () => score++;

  return { name, getMarker, getScore, increaseScore };
}

const button = document.querySelector(".start-game");
button.addEventListener("click", (e) => {
  e.preventDefault();
  gameController.openMenu();
});
