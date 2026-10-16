const displayText = document.querySelector('.display-text');

function createPlayer(name) {
    return {name};
}

const gameboard = (() => {
    let currentPlayer;
    let player1;
    let player2;

    let player1Spaces = [];
    let player2Spaces = [];
    let numOccupiedSpaces = 0;

    let gameOver = false;

    const winCombos = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]

    const reset = () => {
        player1Spaces = [];
        player2Spaces = [];
        currentPlayer = null;
        gameOver = false;
        numOccupiedSpaces = 0;

        const spaces = document.querySelectorAll('.space');
        spaces.forEach(space => {
            space.textContent = '';
            space.style.backgroundColor = "white";
        });
        displayText.textContent = "Click 'Start Game' to play";
    }

    const init = (p1, p2) => {
        reset();
        player1 = p1;
        player2 = p2;
        currentPlayer = p1;
        displayText.textContent = `${p1.name}'s turn (X)`;
    }

    const mark = (space) => {
        if (gameOver || !currentPlayer) {
            return;
        }

        if (player1Spaces.includes(space) || player2Spaces.includes(space)) {
            return;
        }

        if (currentPlayer === player1) {
            player1Spaces.push(space);

            numOccupiedSpaces++;
            display(space, "X");
            checkWin(player1Spaces);
            if (!gameOver) {
                currentPlayer = player2;
                displayText.textContent = `${currentPlayer.name}'s turn (O)`;
            }
        } else {
            player2Spaces.push(space);

            numOccupiedSpaces++;
            display(space, "O");
            checkWin(player2Spaces);
            if (!gameOver) {
                currentPlayer = player1;
                displayText.textContent = `${currentPlayer.name}'s turn (X)`;
            }
        }
    }

    const checkWin = (playerSpaces) => {
        for (const combo of winCombos) {
            let matches = 0;
            for (const space of combo) {
                if (!playerSpaces.includes(space.toString())) {
                    break;
                } else {
                    matches++;
                }
            }
            if (matches === 3) {
                highlightWin(combo);
                displayText.textContent = `${currentPlayer.name} WINS! Game over.`;
                gameOver = true;
                return;
            }
        }
        if (numOccupiedSpaces === 9) {
            displayText.textContent = "TIED. Game over."
            gameOver = true;
        }
    }

    const highlightWin = (combo) => {
        for (const space of combo) {
            let spaceDiv = document.getElementById(space);
            spaceDiv.style.backgroundColor = "lightgrey";
        }
    }

    const display = (space, mark) => {
        let spaceDiv = document.getElementById(space);
        spaceDiv.textContent = mark;
    }

    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;
    const getCurrentPlayer = () => currentPlayer;
    const getPlayer1Spaces = () => player1Spaces;
    const getPlayer2Spaces = () => player2Spaces;

    return {init, reset, mark, getPlayer1, getPlayer2, getCurrentPlayer, getPlayer1Spaces, getPlayer2Spaces};
})();

const startButton = document.querySelector('.start-button');
const resetButton = document.querySelector('.reset-button');
const closeButton = document.querySelector('.close-button');
const form = document.querySelector('form');
const dialog = document.getElementById("start-game-dialog");
const board = document.querySelector('.board');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const player1Name = document.getElementById("p1Name").value;
    const player2Name = document.getElementById("p2Name").value;

    gameboard.init(createPlayer(player1Name), createPlayer(player2Name));

    form.reset();
    dialog.close();
})

resetButton.addEventListener('click', () => {
    gameboard.reset();
})

closeButton.addEventListener('click', () => {
    dialog.close();
})

board.addEventListener('click', (event) => {
    if (gameboard.getCurrentPlayer() && event.target.classList.contains("space")) {
        const spaceElement = event.target.closest(".space");

        gameboard.mark(spaceElement.id);
    }
})