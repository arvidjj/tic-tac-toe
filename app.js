
const GameFlow = (() => {
    const optionsMenu = document.querySelector('.options');
    const optionsBackButton = document.querySelector('#optionsBackButton');

    const playerScore = document.querySelector('.playerScore');
    const oneScore = document.querySelector('#oneScore')
    const twoScore = document.querySelector('#twoScore')

    const playingButtons = document.querySelector('.playingButtons');
    const optionsButton = document.querySelector('#optionsButton');
    const restartButton = document.querySelector('#restartButton');

    const endGameScreen = document.querySelector('#endGameScreen');
    const endMessage = document.querySelector('#endMessage');
    const backEndButton = document.querySelector('#backEndButton')
    const warningScreen = document.querySelector('#warningScreen');
    const warningMessage = document.querySelector('#warningMessage');
    const backWarningButton = document.querySelector('#backWarningButton')

    const fullScreenContainer = document.querySelector('#fsContainer');

    const gameStartForm = document.querySelector('form');
    const nameOne = document.querySelector('#nameOne');
    const nameTwo = document.querySelector('#nameTwo');
    let turn = 0;
    const players = []

    gameStartForm.addEventListener('submit', (event) => {
        event.preventDefault();
        newGame();
    })
    optionsButton.addEventListener('click', () => {
        enableOptionsMenu();
    })
    restartButton.addEventListener('click', () => {
        GameBoard.restartBoard();
        GameBoard.enableBoard();
    })
    optionsBackButton.addEventListener('click', (event) => {
        event.preventDefault()
        enableScoreMenu();
    })
    backWarningButton.addEventListener('click', () => {
        warningScreen.classList.remove('active');
        fullScreenContainer.classList.remove('active');
    })
    backEndButton.addEventListener('click', () => {
        endGameScreen.classList.remove('active');
        fullScreenContainer.classList.remove('active');
    })
    const enableScoreMenu = () => {
        gameStartForm.classList.add('disabled')
        playerScore.classList.remove('disabled');
        playingButtons.classList.remove('disabled');
    }
    const enableOptionsMenu = () => {
        playerScore.classList.add('disabled');
        playingButtons.classList.add('disabled');
        gameStartForm.classList.remove('disabled')
    }
    const renderPlayerScore = () => {
        oneScore.innerHTML = `(x) ${getPlayerById(0).name}: ${getPlayerById(0).getScore()} `
        twoScore.innerHTML = `(o) ${getPlayerById(1).name}: ${getPlayerById(1).getScore()}`
    }
    const newGame = () => {
        if (nameOne.value.length === 0 || nameTwo.value.length === 0) {
            warningMessage.textContent = 'You need to put the names!'
            warningScreen.classList.add('active');
            fullScreenContainer.classList.add('active');
            return
        }
        optionsBackButton.style.display = 'block';
        turn = 0;
        clearPlayers();
        const playerOne = Player(0, 'images/x.png');
        playerOne.name = nameOne.value
        const playerTwo = Player(1, 'images/o.png');
        playerTwo.name = nameTwo.value
        addPlayer(playerOne)
        addPlayer(playerTwo)
        GameBoard.restartBoard();
        GameBoard.enableBoard();
        enableScoreMenu()
        renderPlayerScore();
    }
    const getTurn = () => turn
    const changeTurns = () => {
        turn = turn === 0 ? 1 : 0;
    }
    const addPlayer = (player) => {
        players.push(player);
        console.log("Added player: " + player.name)
    }
    const clearPlayers = (player) => {
        players.length = 0
    }
    const endGame = (result) => {
        GameBoard.disableBoard();
        if (result === 'tie') {
            console.log('Game Tie!')
            endMessage.textContent = 'Game Tie!'
        } else {
            const victoriousPlayer = getPlayerById(result);
            players.forEach((player, index) => {
                if (player.getId() === result) {
                    players[index].addScore();
                }
            })
            console.log(`${victoriousPlayer.name} won the game!`)
            endMessage.textContent = `${victoriousPlayer.name} won the game!`
        }
        renderPlayerScore()
        endGameScreen.classList.add('active');
        fullScreenContainer.classList.add('active');
    }
    const getPlayers = () => players
    const getPlayerByTurn = () => players[turn];
    const getPlayerById = (id) => players.find(x => x.getId() === id)
    return {
        newGame, getTurn, changeTurns, addPlayer, endGame,
        getPlayers, getPlayerByTurn, getPlayerById
    }
})()

const GameBoard = (() => {
    let board = document.querySelector('#gameBoard')
    let gameBoard = [];
    const spots = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const createBoard = () => {
        for (let row = 0; row < 3; row++) {
            const rowArray = [];
            for (let col = 0; col < 3; col++) {
                const addedSpot = document.createElement('div');
                addedSpot.classList.add('spot')
                const id = `spot-${row}-${col}`
                addedSpot.setAttribute('id', id)
                board.appendChild(addedSpot)

                rowArray.push(addedSpot);
            }
            gameBoard.push(rowArray);
        }
        //CREATE THE GAMEBOARD AND ASSIGN CLICK EVENT of ADDSPOT
        gameBoard.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                column.addEventListener('click', () => {
                    console.log(`clicked ${column.getAttribute('id')} index: ${rowIndex}-${columnIndex}`)
                    if (column.classList.contains('disabled')) {
                        console.log('Board is disabled')
                    } else {
                        addSpot(rowIndex, columnIndex, GameFlow.getPlayerByTurn().getId())
                    }
                })
            })
        })
    }

    const render = () => {
        spots.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                if (column !== '') {
                    if (!(gameBoard[rowIndex][columnIndex].classList.contains('taken'))) {
                        gameBoard[rowIndex][columnIndex].innerHTML = `<img src="${GameFlow.getPlayerById(spots[rowIndex][columnIndex]).getMarker()}">`
                        gameBoard[rowIndex][columnIndex].classList.add('taken')
                    }
                } else {
                    gameBoard[rowIndex][columnIndex].innerHTML = ``
                    gameBoard[rowIndex][columnIndex].classList.remove('taken')
                }
            })
        })
        //CHECK ENDGAME
        checkWin();
    }

    const restartBoard = () => { //NOT FUNCTIONAL CURRENT VERSION
        spots.forEach((row, place) => {
            spots[place] = ['', '', ''];
        })
        render();
    }

    const addSpot = (row, column, id) => {
        if (spots[row][column] === '') {
            spots[row][column] = id;
            render();
            GameFlow.changeTurns();
            console.log(`${GameFlow.getPlayerByTurn().name} turn`)
        } else {
            console.log('this place is taken!')
        }
    }

    const checkWin = () => {
        const winCheckSet = new Set(); //USE SETS TO CALCULATE WIN
        //CHECK ROWS
        spots.forEach(row => {
            const winCheckSet = new Set(row);
            if (winCheckSet.size === 1 && row[0] !== '') {
                console.log('Game won by rows')
                GameFlow.endGame(row[0]); //returns win and player id
                return
            }
        });
        //CHECK COLUMNS
        for (let i = 0; i < spots.length; i++) {
            winCheckSet.clear(); //clear win set to check next column
            for (let o = 0; o < spots[i].length; o++) {
                winCheckSet.add(spots[o][i])
            }
            if (winCheckSet.size === 1 && !winCheckSet.has('')) {
                console.log('Game won by columns')
                GameFlow.endGame(spots[0][i]); //returns win and player id
                return
            }
        }
        //CHECK DIAGONALS
        winCheckSet.clear();
        for (let i = 0; i < spots.length; i++) {
            winCheckSet.add(spots[i][i])
        }
        if (winCheckSet.size === 1 && !winCheckSet.has('')) {
            console.log('Game won by diagonals')
            GameFlow.endGame(spots[0][0]); //returns win and player id
            return
        }
        //INVERSE DIAGONALS
        winCheckSet.clear();
        for (let i = 0; i < spots.length; i++) {
            winCheckSet.add(spots[i][spots.length - i - 1])
        }
        if (winCheckSet.size === 1 && !winCheckSet.has('')) {
            console.log('Game won by inverse diagonals')
            GameFlow.endGame(spots[0][spots.length - 1]); //returns win and player id
            return
        }
        //TIE CHECK
        if (spots.every(x => (x.every(a => a !== '')))) {
            console.log('Game Tie')
            GameFlow.endGame('tie');
            return
        }
    }
    const disableBoard = () => { //DISABLED BOARD
        spots.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                gameBoard[rowIndex][columnIndex].classList.add('disabled')
            })
        })
    }
    const enableBoard = () => { //ENABLE BOARD
        spots.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                gameBoard[rowIndex][columnIndex].classList.remove('disabled')
            })
        })
    }
    const getGameBoard = () => gameBoard
    const getSpots = () => spots
    return {
        createBoard,
        addSpot, render, getGameBoard, getSpots, restartBoard,
        checkWin, disableBoard, enableBoard
    }
})()

const Player = (id, marker) => {
    let score = 0;

    const getId = () => id;
    const getMarker = () => marker;
    const getScore = () => score;
    const setScore = (value) => {
        this.score = value;
    }
    const addScore = () => {
        score += 1;
    }

    const placeMarker = () => {
        let gameBoard = GameBoard.getGameBoard();
        let index = 0;

        console.log('Placing ' + id + ' at ' + index)
        GameBoard.addSpot(index, id)
    }

    return {
        getId, getMarker, getScore, setScore, addScore, placeMarker
    }
};


//GameBoard.render();