
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
        } else if (result === 'win') {
            console.log('Game wom!')
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
    const gameBoard = Array.from(document.querySelectorAll('#gameBoard>div'))
    const spots = [
        ['x', 'x', 'x'],
        ['', '', ''],
        ['', '', '']
    ];

    gameBoard.forEach((spot, index) => {
        spot.addEventListener('click', () => {
            console.log('clicked ' + spot.getAttribute('id'))
            addSpot(index, GameFlow.getPlayerByTurn().getId())
        })
    })

    const restartBoard = () => {
        spots.forEach((spot, place) => spots[place] = '')
        render();
    }
    const addSpot = (place, id) => {
        if (spots[place] === '') {
            spots[place] = id;
            render();
            GameFlow.changeTurns();
            console.log(`${GameFlow.getPlayerByTurn().name} turn`)
        } else {
            console.log('this place is taken!')
        }
    }

    const render = () => { 
        gameBoard.forEach((spot, index) => {
            if (spots[index] !== '') {
                spot.innerHTML = `<img src="${GameFlow.getPlayerById(spots[index]).getMarker()}">`
            }
        })
        //CHECK ENDGAME
        checkWin();
    }

    const checkWin = () => {
        if (spots.every(x => (x.every(a => a!==''))) ) {
            console.log('tie')
            GameFlow.endGame('tie');
        }
        if (spots[0] === spots[3] === spots[6]) {
            GameFlow.endGame('win');
        }
    }
    const getGameBoard = () => gameBoard
    const getSpots = () => spots
    return {
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

GameBoard.render();