
const GameFlow = (() => {
    const endGameScreen = document.querySelector('#endGameScreen');
    const opacityElements = document.querySelector('.opacityElements');
    let turn = 0;
    const players = []

    const restartGame = () => {
        turn = 0;
    }
    const getTurn = () => turn
    const changeTurns = () => {
        turn = turn === 0 ? 1 : 0;
    }
    const addPlayer = (player) => {
        players.push(player);
        console.log("Added player: " + player.name)
    }
    const endGame = (result) => {
        if (result === 'tie') {
            console.log('Game Tie!')
        } else {
            const victoriousPlayer = getPlayerById(result);
            console.log(`${victoriousPlayer.name} won the game!`)
        }
        endGameScreen.classList.add('active');
        opacityElements.style.opacity = '30%';
    }
    const getPlayers = () => players
    const getPlayerByTurn = () => players[turn];
    const getPlayerById = (id) => players.find(x => x.getId() === id)
    return {
        restartGame, getTurn, changeTurns, addPlayer, endGame,
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

    const getPosition = (position) => {

    }
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
                    addSpot(rowIndex, columnIndex, GameFlow.getPlayerByTurn().getId())
                })
            })
        })
    }

    const render = () => {
        spots.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                if (column !== '') {
                    gameBoard[rowIndex][columnIndex].innerHTML = `<img src="${GameFlow.getPlayerById(spots[rowIndex][columnIndex]).getMarker()}">`
                }
            })
        })
        //CHECK ENDGAME
        checkWin();
    }

    const restartBoard = () => { //NOT FUNCTIONAL CURRENT VERSION
        //spots.forEach((spot, place) => spots[place] = '')
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
        //CHECK ROWS
        spots.forEach(row => {
            const mySet = new Set(row); //USE SETS TO CALCULATE WIN
            if (mySet.size === 1 && row[0] !== '') {
                console.log('Game won by rows')
                GameFlow.endGame(row[0]); //returns win and player id
                return
            }
        });
        //CHECK DIAGONALS
        const mySet = new Set();
        for (let i = 0; i < spots.length; i++) { 
            mySet.add(spots[i][i])
            //console.log(mySet)
        }
        if (mySet.size === 1 && !mySet.has('')) {
            console.log('Game won by diagonals')
            GameFlow.endGame(spots[0][0]); //returns win and player id
            return
        }
        //INVERSE DIAGONALS
        mySet.clear();
        for (let i = 0; i < spots.length; i++) { 
            mySet.add(spots[i][spots.length-i-1])
            //console.log(mySet)
        }
        if (mySet.size === 1 && !mySet.has('')) {
            console.log('Game won by inverse diagonals')
            GameFlow.endGame(spots[0][spots.length-1]); //returns win and player id
            return
        }
        //TIE CHECK
        if (spots.every(x => (x.every(a => a !== '')))) {
            console.log('Game Tie')
            GameFlow.endGame('tie');
            return
        }
    }
    const getGameBoard = () => gameBoard
    const getSpots = () => spots
    return {
        createBoard,
        addSpot, render, getGameBoard, getSpots, restartBoard,
        checkWin
    }
})()

const Player = (id, marker) => {
    let score = 0;

    const getId = () => id;
    const getMarker = () => marker;
    const getScore = () => score;

    const placeMarker = () => {
        let gameBoard = GameBoard.getGameBoard();
        let index = 0;

        console.log('Placing ' + id + ' at ' + index)
        GameBoard.addSpot(index, id)
    }

    return {
        getId, getMarker, getScore, placeMarker
    }
};

const playerOne = Player(0, 'images/x.png');
playerOne.name = 'Will'
const playerTwo = Player(1, 'images/o.png');
playerTwo.name = 'Leonard'
GameFlow.addPlayer(playerOne)
GameFlow.addPlayer(playerTwo)

GameBoard.createBoard()
GameBoard.render();