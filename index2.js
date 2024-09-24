const gameController = (function () {
  let isWin = false;
  let isDraw = false;
  let players = [];
  let currentPlayer;
  let turnsPlayed = 0;

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

  const initialiseBoard = () => {
    const grid = document.querySelectorAll(".card");

    grid.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (e.target.classList[2] == "filled") {
          return;
        } else {
          takePlayerTurn(e.target.classList);
        }
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
    const dialog = document.querySelector("dialog");
    dialog.showModal();
  };

  const setupMenu = () => {
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
      console.log("Instance of submit clicked");

      event.preventDefault();
      playerName = document.querySelector('[name="player-name"]').value;
      playerMarker = document.querySelector(
        'input[name="player-marker"]:checked'
      ).value;

      const player = createPlayer(playerName, playerMarker);
      console.log(player.name + " created with marker: " + player.getMarker());

      const computer = initiateComputer(player.getMarker());

      players.push(player);
      players.push(computer);

      dialog.close();

      pickTurn();
      initialiseBoard();
      playGame();
    });
  };

  const pickTurn = () => {
    let playerIndex = Math.floor(Math.random() * 2);
    currentPlayer = players[playerIndex];
    console.log(currentPlayer.name);
  };

  const displayMarker = (marker, row, col) => {
    console.log("CURRENT PLAYER IS: " + currentPlayer.name);
    let cellClass = ".cell-" + row + "-" + col;
    const cell = document.querySelector(cellClass);
    console.log("class is " + cellClass);

    if (cell.classList[2] == "filled") {
      console.log("already contains an item, try that again!");
      takeTurn();
    }

    console.log("Trying to display " + marker);

    cell.textContent = marker;
    cell.classList.toggle("filled");
    console.log(cell.classList[2] + " dat thang");
    console.log(
      currentPlayer.name + "'s child marker appended to cell: " + marker
    );
  };

  const takePlayerTurn = (cellClassList) => {
    console.log(cellClassList[1]);
    console.log(cellClassList);

    console.log("takePlayerTurn player: " + currentPlayer.getMarker());

    let indexRow = cellClassList[1].split("-")[1];
    let indexCol = cellClassList[1].split("-")[2];
    let cellClass = ".cell-" + indexRow + "-" + indexCol;
    const cell = document.querySelector(cellClass);
    console.log("class is " + cellClass);

    if (cell.classList[2] == "filled") {
      console.log("already contains an item, try that again!");
      takeTurn();
    }

    gameboard.updateBoard(currentPlayer.getMarker(), indexRow, indexCol);

    displayMarker(currentPlayer.getMarker(), indexRow, indexCol);
    [isWin, isDraw] = gameboard.checkGameState();
    console.log("IN PLAYER TURN: " + gameboard.getWinningMarker());

    toggleTurn();
    turnsPlayed++;
    playRound();
  };

  const takeTurn = (player) => {
    const divTurn = document.querySelector("div.turn");
    while (divTurn.firstChild) {
      divTurn.removeChild(divTurn.firstChild);
    }
    console.log("Current player turn is: " + player.name);

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

      let cellClass = ".cell-" + selectRow + "-" + selectCol;
      const cell = document.querySelector(cellClass);
      console.log("class is " + cell.classList[2]);

      if (cell.classList[2] == "filled") {
        takeTurn(player);
      }

      gameboard.updateBoard(player.getMarker(), selectRow, selectCol);
      displayMarker(player.getMarker(), selectRow, selectCol);
      [isWin, isDraw] = gameboard.checkGameState();

      toggleTurn();

      turnsPlayed++;
      playRound();
    }
  };

  const toggleTurn = () => {
    if (currentPlayer == players[0]) {
      currentPlayer = players[1];
    } else {
      currentPlayer = players[0];
    }
  };

  //   const removeEventListenerAll = (
  //     targets,
  //     type,
  //     listener,
  //     options,
  //     useCapture
  //   ) => {
  //     targets.forEach((target) =>
  //       target.removeEventListener(type, listener, options, useCapture)
  //     );
  //   };

  resetBoard = () => {
    const cards = document.querySelectorAll(".card");
    const turn = document.querySelector(".turn");
    const result = document.querySelector(".result");
    result.textContent = "";
    turn.textContent = "";
    cards.forEach((card) => {
      card.textContent = "";
      card.classList.remove("filled");
      let cardClone = card.cloneNode(true);
      card.parentNode.replaceChild(cardClone, card);
      console.log("Resetting event listener");
    });
    // document.querySelector(".result").remove();
    gameboard.resetGameBoard();

    isWin = false;
    isDraw = false;
    players = [];
    currentPlayer = "";
    turnsPlayed = 0;
    currentPlayer = "";
    gameboard.displayBoard();
    console.log(isWin, isDraw, currentPlayer, players, turnsPlayed);
  };

  const endGame = () => {
    const containerDivs = document.querySelectorAll(".card");
    containerDivs.forEach((cell) => {
      if (cell.classList[2] != "filled") {
        cell.classList.toggle("filled");
      }
    });

    let winner;

    if (players[0].getMarker() == gameboard.getWinningMarker()) {
      winner = players[0].name;
    } else if (players[1].getMarker() == gameboard.getWinningMarker()) {
      winner = players[1].name;
    }

    const result = document.querySelector(".result");
    result.textContent = "Winner is " + winner;
    const newGame = document.createElement("button");
    newGame.textContent = "NEW GAME";
    newGame.addEventListener("click", resetBoard);
    result.appendChild(newGame);
  };

  const playRound = () => {
    if (!isWin && !isDraw) {
      takeTurn(currentPlayer);
    } else {
      endGame();
    }
  };

  const playGame = () => {
    //Asks player for Name and marker in a dialog box
    // initialiseBoard();

    // Choose a player randomly to take turn first
    playRound();
  };

  const start = () => {
    gameController.openMenu();
  };

  return { openMenu, setupMenu, playGame, getWin, getDraw, resetBoard, start };
})();

const gameboard = (function () {
  let board = [
    ["_", "_", "_"],
    ["_", "_", "_"],
    ["_", "_", "_"],
  ];

  const resetGameBoard = () =>
    (board = [
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "_", "_"],
    ]);

  let winningMarker;

  const updateBoard = (marker, indexRow, indexCol) => {
    board[indexRow][indexCol] = marker;
    displayBoard();
  };

  const updateWinningMarker = (marker) => {
    console.log("Setting: " + this.winningMarker + "To: " + marker);

    this.winningMarker = marker;
    console.log(this.winningMarker);
  };
  const displayBoard = () => {
    board.forEach((row) => {
      console.log(row);
    });
  };

  const getWinningMarker = () => {
    return this.winningMarker;
  };

  const checkCell = (row, col) => {
    return board[row][col];
  };

  const checkGameState = () => {
    let isWinner = false;
    let isDraw = false;
    let winMark = "";
    let filledCount = 0;

    //Rows

    for (let x = 0; x < board.length; x++) {
      let prevCell = "";
      let matches = 1;
      let row = board[x];
      let cell;
      for (let y = 0; y < board.length; y++) {
        cell = row[y];
        // console.log(cell + " vs. Previous: " + prevCell);

        if (cell == "_") {
          prevCell = cell;
          break;
        }
        if (cell == prevCell) {
          matches++;
        }
        prevCell = cell;
        filledCount++;
      }

      if (matches == 3) {
        winMark = cell;
        isWinner = true;
        break;
      }
    }

    // Columns

    if (!isWinner || !isDraw) {
      for (let x = 0; x < board.length; x++) {
        let prevCell = "";
        let matches = 1;
        let cell;
        for (let y = 0; y < board.length; y++) {
          cell = board[y][x];
          //   console.log(cell + " vs. Previous: " + prevCell);

          if (cell == "_") {
            prevCell = cell;
            break;
          }
          if (cell == prevCell) {
            matches++;
          }
          prevCell = cell;
        }

        if (matches == 3) {
          winMark = cell;

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
      console.log(firstCell, secondCell, thirdCell);
      if (
        firstCell == secondCell &&
        secondCell == thirdCell &&
        firstCell != "_"
      ) {
        winMark = thirdCell;

        isWinner = true;
      }
    }

    // Second diagonal
    if (!isWinner && !isDraw) {
      let firstCell = board[0][2];
      let secondCell = board[1][1];
      let thirdCell = board[2][0];
      console.log(firstCell, secondCell, thirdCell);

      if (
        firstCell == secondCell &&
        secondCell == thirdCell &&
        firstCell != "_"
      ) {
        isWinner = true;

        winMark = thirdCell;
      }
    }

    if (filledCount == 9 && !isWinner) {
      isDraw = true;
    }

    updateWinningMarker(winMark);

    return [isWinner, isDraw];
  };

  return {
    updateBoard,
    getWinningMarker,
    displayBoard,
    checkGameState,
    checkCell,
    winningMarker,
    updateWinningMarker,
    resetGameBoard,
  };
})();

function createPlayer(name, marker) {
  const score = 0;
  const getMarker = () => marker;
  const getScore = () => score;
  const increaseScore = () => score++;

  return { name, getMarker, getScore, increaseScore };
}
const reset = document.querySelector(".reset");
reset.addEventListener("click", gameController.resetBoard);

gameController.setupMenu();

const button = document.querySelector(".start-game");
button.addEventListener("click", (e) => {
  console.log("Start clicked");

  e.preventDefault();
  gameController.start();
});
