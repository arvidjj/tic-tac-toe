
const GameFlow = (() => {
    let turn = 0;
    const numberOfPlayers = []

    const getTurn = () => turn
    const changeTurns = () => {
        turn = turn === 0 ? 1 : 0;
    }
    const addPlayer = (player) => {
        numberOfPlayers.push(player);
        console.log("Added player: " + player.name)
    }
    const getPlayer = () => {
        return numberOfPlayers[turn];
    }
    return {
        getTurn, changeTurns, addPlayer, getPlayer
    }
})()

const GameBoard = (() => {
    const gameBoard = Array.from(document.querySelectorAll('#gameBoard>div'))
    const spots = [
        '', '', '',
        '', '', '',
        '', '', '',
    ];

    gameBoard.forEach((spot, index) => {
        spot.addEventListener('click', () =>{
            console.log('clicked ' + spot.getAttribute('id'))
            addSpot(index, GameFlow.getPlayer().getMarker())
            return this
        })
    })

    const addSpot = (place, marker) => {
        if (spots[place] === '') {
            spots[place] = marker;
            render();
            GameFlow.changeTurns();
        } else {
            console.log('this place is taken!')
        }
    }

    const render = () =>{
        gameBoard.forEach((spot,index) => {
            spot.innerHTML = `${spots[index]}`
        })
    }
    const getGameBoard = () => gameBoard
    return {
        addSpot, render, getGameBoard
    }
})()

const Player = (marker) => {
    marker: marker;
    let score = 0;

    const getMarker = () => marker;
    const getScore = () => score;

    const placeMarker = () => {
        let gameBoard = GameBoard.getGameBoard();
        let index = 0;

        console.log('Placing ' + marker + ' at ' + index)
        GameBoard.addSpot(index , marker)
    }

    return {
        getMarker, getScore, placeMarker
    }
};

const playerOne = Player('x');
playerOne.name = 'Will'
const playerTwo = Player('o');
playerTwo.name = 'Leonard'
GameFlow.addPlayer(playerOne)
GameFlow.addPlayer(playerTwo)

GameBoard.render();